'use strict';

const Bot = require('./Bot/bot');
const Express = require('express');
const bodyParser = require('body-parser');

const server = Express();

server.use(bodyParser.json());

let bot = new Bot({
    file: './training-data.rive',
    defaultUser: 'localuser'
});

// FB webhook
server.post("/webhook", function (req, res) {
    // Make sure this is a page subscription
    if (req.body.object == "page") {
        // Iterate over each entry
        // There may be multiple entries if batched
        req.body.entry.forEach(function(entry) {
        // Iterate over each messaging event
        entry.messaging.forEach(function(event) {
            if (event.postback) {
                processPostback(event);
            }
        });
        });

        res.sendStatus(200);
    }
});

// Adds support for GET requests to our webhook
server.get('/webhook', (req, res) => {
    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = process.env.VERIFY_TOKEN;
        
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
        
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);      
        }
    }
});

function processPostback(event) {
    var senderId = event.sender.id;
    var payload = event.postback.payload;

    if (payload === "Greeting") {
        // Get user's first name from the User Profile API
        // and include it in the greeting
        request({
            url: "https://graph.facebook.com/v2.6/" + senderId,
            qs: {
                access_token: process.env.PAGE_ACCESS_TOKEN,
                fields: "first_name"
            },
            method: "GET"
        }, function(error, response, body) {
            var greeting = "";
            if (error) {
                console.log("Error getting user's name: " +  error);
            } else {
                var bodyObj = JSON.parse(body);
                name = bodyObj.first_name;
                greeting = "Hi " + name + ". ";
            }
            var message = greeting + "My name is SP Movie Bot. I can tell you various details regarding movies. What movie would you like to know about?";
            sendMessage(senderId, {text: message});
        });
    }
}

function sendMessage(recipientId, message) {
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: {
            access_token: process.env.PAGE_ACCESS_TOKEN
        },
        method: "POST",
        json: {
            recipient: {
                id: recipientId
            },
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log("Error sending message: " + response.error);
        }
    });
}

server.get([
    '/',
    '/:message',
    ], (req, res) => {
        bot.ask(req.params.message)
            .then( reply => {
                res.send(reply);
            })
            .catch( err => console.error(err));
});
  
server.listen(process.env.PORT || 8080, () => console.log('Server has started'));