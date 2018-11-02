const HTTP = require("./enums/http");

const cors = (req, res, next) => {
  let headers = [];
  let code = 200;
  if (req.method === HTTP.GET) {
    headers = [
      ...headers,
      {
        "Access-Control-Allow-Origin": process.env.ALLOWED_DOMAINS
      },
      {
        "Access-Control-Allow-Credentials": " true"
      },
      {
        "Cache-Control": " no-cache"
      },
      {
        Pragma: " no-cache"
      },
      {
        "Content-Type": " text/plain"
      }
    ];
  } else if (req.method === HTTP.OPTIONS) {
    headers = [
      ...headers,
      {
        "Access-Control-Allow-Origin": "http://arunranga.com"
      },
      {
        "Access-Control-Allow-Methods": "GET, OPTIONS"
      },
      {
        "Access-Control-Allow-Credentials": "true"
      },
      {
        "Access-Control-Max-Age": "1728000"
      },
      {
        "Content-Length": "0"
      },
      {
        "Content-Type": "text/plain"
      }
    ];
    code = 403;
  } else {
    headers = [...headers, { "Content-Type": "text/plain" }];
    code = 400;
    res.cookie("pageAccess", "-1", { maxAge: -1 });
  }
  headers.forEach(header => res.header(header));
  res.status(code);
  next();
};

module.exports = cors;
