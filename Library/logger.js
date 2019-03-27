class Logger {
  constructor(ref) {
    this.database = ref;
  }

  log(level, message) {
    try {
      this.database.child("logs").push({
        level,
        message,
        date: Date()
      });
    } catch (err) {
      console.error(err);
    }
  }

  logConversation(ip) {
    if (!ip) return;
    try {
      this.database.child(`conversations/${ip}`).set({
        lastUpdated: Date()
      });
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = Logger;
