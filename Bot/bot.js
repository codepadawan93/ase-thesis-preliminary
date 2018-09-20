const RiveScript = require('rivescript');

function Bot(config){

    if(!config || !config.file) return;
    
    let proxy = {};
    
    proxy.riveScriptInterpreter = new RiveScript();
    proxy.riveScriptInterpreter
        .loadFile(config.file)
        .then(function(){
            proxy.riveScriptInterpreter.sortReplies();
        })
        .catch(err => console.error(err));
        
    this.ask = function(msg){
        return proxy.riveScriptInterpreter.reply(msg);
    };
};

module.exports = Bot;