const Bot = require('./Bot/bot');
const Express = require('express');
  
const server = Express();

const serverOptions = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html'],
    index: false,
    maxAge: '1d',
    redirect: false,
    setHeaders: function (res, path, stat) {
        res.set('x-timestamp', Date.now())
    }
};

server.use(Express.static('public', serverOptions));

const bot = new Bot({file:'./training-data.rive'});

server.get('/', function(req, res){
    bot.ask("d")
        .then(replyText => {
            res.send(replyText);
        })
        .catch(err => console.error(err));
});
  
server.listen(process.env.port || 8080);