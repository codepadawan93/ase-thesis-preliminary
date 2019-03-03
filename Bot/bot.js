const RiveScript = require("rivescript");

class Bot {
  constructor(config) {
    if (!config || !config.file || !config.defaultUser) {
      throw new Error("Error reading config object.");
    }
    this.config = config;
    this.riveScriptInterpreter = new RiveScript({
      utf8: true
    });

    this.riveScriptInterpreter
      .loadFile(this.config.file)
      .then(() => {
        this.riveScriptInterpreter.sortReplies();
      })
      .catch(err => console.error(err));
  }
  ask(message, user) {
    return this.riveScriptInterpreter.reply(
      user || this.config.defaultUser,
      message
    );
  }
}

module.exports = Bot;
