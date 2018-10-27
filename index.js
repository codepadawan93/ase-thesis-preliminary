"use strict";

const Bot = require("./Bot/bot");
const Express = require("express");
const basicAuth = require("express-basic-auth");
const bodyParser = require("body-parser");

const request = require("request");
const path = require("path");

const messageTypes = require("./Models/messageTypes");
const server = Express();

server.use(bodyParser.json());
server.use(Express.static("./Static"));

let bot = new Bot({
  file: "./RiveScript/training-data.rive",
  defaultUser: "localuser"
});

/**
 * Handle Facebook integration requests
 *
 */
server.post("/webhook", (req, res) => {
  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === "page") {
    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {
      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log("Sender PSID: " + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });

    // Return a '200 OK' response to all events
    res.status(200).send("EVENT_RECEIVED");
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});

// Adds support for GET requests to our webhook
server.get("/webhook", (req, res) => {
  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  // Parse the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(403);
  }
});

// Handles messages events
function handleMessage(sender_psid, received_message) {
  let response;

  // Checks if the message contains text
  if (received_message.text) {
    bot
      .ask(received_message.text)
      .then(reply => {
        // Create the payload for a basic text message, which
        // will be added to the body of our request to the Send API
        response = {
          text: reply
        };
        console.log(response);
        // Send the response message
        callSendAPI(sender_psid, response);
      })
      .catch(err => console.error(err));
  } else if (received_message.attachments) {
    // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: "Is this the right picture?",
              subtitle: "Tap a button to answer.",
              image_url: attachment_url,
              buttons: [
                {
                  type: "postback",
                  title: "Yes!",
                  payload: "yes"
                },
                {
                  type: "postback",
                  title: "No!",
                  payload: "no"
                }
              ]
            }
          ]
        }
      }
    };
    callSendAPI(sender_psid, response);
  }
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
  let response;

  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === "yes") {
    response = { text: "Thanks!" };
  } else if (payload === "no") {
    response = { text: "Oops, try sending another image." };
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid
    },
    message: response
  };

  // Send the HTTP request to the Messenger Platform
  request(
    {
      uri: "https://graph.facebook.com/v2.6/me/messages",
      qs: {
        access_token: PAGE_ACCESS_TOKEN
      },
      method: "POST",
      json: request_body
    },
    (err, res, body) => {
      if (!err) {
        console.log("message sent!");
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );
}

/**
 * Add headers for all responses
 *
 */
server.use(function(req, res, next) {
  res.set("Content-Type", "application/json");
  res.set("Access-Control-Allow-Origin", "http://localhost:3000");
  res.set("Access-Control-Allow-Headers", "Authorization");
  res.set("Access-Control-Allow-Credentials", "true");
  next();
});

// respond to OPTIONS requests with 200
server.options("*", (req, res) => {
  res.sendStatus(200);
});

/**
 * Add HTTP auth and return json if no auth is present
 *
 */
const basicAuthConfig = {
  users: {},
  unauthorizedResponse: req => {
    const res = {
      success: false,
      message: "401 unauthorized"
    };
    return req.auth || JSON.stringify(res);
  }
};

// Set username/pass fron env variables
basicAuthConfig.users[process.env.ADMIN_USERNAME] = process.env.ADMIN_PASSWORD;
server.use(basicAuth(basicAuthConfig));

/**
 * Then handle direct requests
 *
 */
server.get(["/api", "/api/:message"], (req, res) => {
  console.log(req.auth);
  bot
    .ask(req.params.message)
    .then(reply => {
      res.json({
        success: true,
        type: messageTypes.plain,
        message: reply
      });
    })
    .catch(err => {
      console.error(err);
      res.json({
        success: false,
        errorMessage: err
      });
    });
});

// Start server
server.listen(process.env.PORT || 8080, function() {
  console.log("Server has started on port " + this.address().port);
});
