const Bot = require('./Bot/bot');
const Express = require('express');
  
const server = Express();

const serverOptions = {
    dotfiles: 'ignore',
    etag: false,
    extensions: [],
    index: false,
    maxAge: '1d',
    redirect: false,
    setHeaders: function (res, path, stat) {
        res.set('x-timestamp', Date.now())
    }
};

server.use(Express.static('public', serverOptions));

let bot = new Bot({file:'./training-data.rive'});

server.get('/', function(req, res){
    bot.ask(req.query.q)
        .then(function(replyText){
            res.send(replyText);
        })
        .catch(err => console.error(err));
});
  
server.listen(process.env.port || 8080);