const fs = require("fs");

module.exports = class CredManager {
  static SERVICE_ACCOUNT_JSON_PATH() {
    return "./Config/serviceAccountKey.json";
  }
  static CONFIG_JSON_PATH() {
    return "./Static/src/config/config.json";
  }

  static createServiceAccountJson() {
    if (fs.existsSync(CredManager.SERVICE_ACCOUNT_JSON_PATH())) {
      return;
    }
    const jsonBase64 = process.env.SERVICE_ACCOUNT_JSON;
    if (jsonBase64) {
      const json = new Buffer(jsonBase64, "base64").toString("ascii");
      fs.writeFileSync(CredManager.SERVICE_ACCOUNT_JSON_PATH(), json, err => {
        if (err) console.error(err);
      });
    } else {
      console.error("No credentials set.");
    }
  }

  static createConfigJson() {
    if (fs.existsSync(CredManager.CONFIG_JSON_PATH())) {
      return;
    }
    const jsonBase64 = process.env.CONFIG_JSON;
    if (jsonBase64) {
      const json = new Buffer(jsonBase64, "base64").toString("ascii");
      fs.writeFileSync(CredManager.CONFIG_JSON_PATH(), json, err => {
        if (err) console.error(err);
      });
    } else {
      console.error("No credentials set.");
    }
  }
};
