module.exports = class Utils {
  static replaceInvalidChars(string) {
    let retval = string;
    const map = {
      ă: "a",
      â: "a",
      Ă: "A",
      Â: "A",
      ş: "s",
      ș: "s",
      Ş: "S",
      ţ: "t",
      ț: "t",
      Ţ: "T",
      î: "i",
      Î: "I",
      "\\?": ""
    };
    for (let key in map) {
      retval = retval.replace(new RegExp(key, "gi"), map[key]);
    }
    return retval;
  }
};
