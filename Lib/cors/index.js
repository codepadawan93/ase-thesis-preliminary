const HTTP = require("./enums/http");

const cors = (req, res, next) => {
  let headers = [];
  let code = 200;

  const origin = req.headers.referer;

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
    if (process.env.ALLOWED_DOMAINS.split(", ").indexOf(origin) !== -1) {
      headers = [
        ...headers,
        {
          "Access-Control-Allow-Origin": process.env.ALLOWED_DOMAINS
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
    } else {
      code = 403;
    }
  } else {
    headers = [...headers, { "Content-Type": "text/plain" }];
    code = 400;
  }
  headers.forEach(header => res.header(header));
  res.status(code);
  next();
};

module.exports = cors;
