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
    setHeaders: (res, path, stat) => {
        res.set('x-timestamp', Date.now())
    }
};

server.use(Express.static('public', serverOptions));

let bot = new Bot({
    file: './training-data.rive',
    defaultUser: 'localuser'
});

server.get('/:message', (req, res) => {
    bot.ask(req.params.message)
        .then((reply) => {
            res.send(reply);
        })
        .catch(err => console.error(err));
});
  
server.listen(process.env.port || 8080);