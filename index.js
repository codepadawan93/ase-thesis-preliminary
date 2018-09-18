const ReadLine = require('readline');
const Chalk = require('chalk');
const RiveScript = require('rivescript');

const bot = new RiveScript();
const rl = new ReadLine.createInterface({
    input: process.stdin,
    output: process.stdout
});

bot
    .loadFile('./training-data.rive')
    .then(function(){
        bot.sortReplies();
        ask();
    })
    .catch(err=>console.error(err));

let ask = function(){
    rl.question("You: ", msg => {
        bot
            .reply('local-user', msg)
            .then(reply => {
                console.log(Chalk.red("Bot: " + reply));
                ask();
            })
            .catch(err=>console.error(err))
    });
}