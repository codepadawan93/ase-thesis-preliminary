module.exports = class Utils {
  static replaceInvalidChars(string) {
    const map = {
      ă: "a",
      â: "a",
      Ă: "A",
      Â: "A",
      ş: "s",
      Ş: "S",
      ţ: "ţ",
      Ţ: "T",
      î: "i",
      Î: "I",
      "?": ""
    };
    for (let key in map) {
      string = string.replace(key, map[key]);
    }
    return string;
  }
};
