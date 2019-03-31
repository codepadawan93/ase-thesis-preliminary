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

  async logTerm(term) {
    if (!term) return;
    try {
      const dataSnapshot = await this.database
        .child(`terms/${term}`)
        .once("value");
      const val = dataSnapshot.val();
      if (val == null) {
        this.database.child(`terms/${term}`).set({
          frequency: 1,
          lastUpdated: Date()
        });
      } else {
        this.database.child(`terms/${term}`).update({
          frequency: val.frequency + 1,
          lastUpdated: Date()
        });
      }
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
