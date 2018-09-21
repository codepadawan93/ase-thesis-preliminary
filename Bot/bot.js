const RiveScript = require('rivescript');

function Bot(config){

    if(!config || !config.file) throw new Error("Error reading config object.");
    
    this.riveScriptInterpreter = new RiveScript();
    
    let proxy = this;
    this.riveScriptInterpreter
        .loadFile(config.file)
        .then(function(){
            proxy.riveScriptInterpreter.sortReplies();
        })
        .catch(err => console.error(err));
        
    this.ask = function(message){
        return this.riveScriptInterpreter.reply(message);
    };
};

module.exports = Bot;