const RiveScript = require("rivescript");

function Bot(config) {
  if (!config || !config.file || !config.defaultUser)
    throw new Error("Error reading config object.");

  const riveScriptInterpreter = new RiveScript({
    utf8: true
  });

  riveScriptInterpreter
    .loadFile(config.file)
    .then(() => {
      riveScriptInterpreter.sortReplies();
    })
    .catch(err => console.error(err));

  this.ask = (message, user) => {
    return riveScriptInterpreter.reply(user || config.defaultUser, message);
  };
}

module.exports = Bot;
