// If an api key does not exist, create it
const CredManager = require("./Library/cred-manager");
CredManager.createServiceAccountJson();
CredManager.createConfigJson();
