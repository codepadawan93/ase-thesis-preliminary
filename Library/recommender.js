const fs = require("fs");
const Engine = require("./engine");

class Recommender {
  constructor() {
    this.engine = new Engine();
    this.userName = null;

    // read the files
    const responsesData = fs.readFileSync("./Data/responses.json", "utf-8");
    const attractionsData = fs.readFileSync("./Data/attractions.json", "utf-8");

    // and extract the data
    this.responses = JSON.parse(responsesData);
    this.attractions = JSON.parse(attractionsData);
  }
  parse(event) {
    const parts = event.split(/=/);
    const type = parts[0];
    const term = parts[1] || "";
    this.engine.fit(this.responses, this.attractions);
    switch (type) {
      case "expression.attribution.username":
        return this.setUserName(term);
      case "query.recommend.term":
        return this.recommend(term);
      case "query.recommend.all":
        return this.recommendAll();
      case "query.inform.term":
        return "TODO";
      case "query.image.term":
        return "TODO";
      default:
        return event;
    }
  }
  setUserName(userName) {
    if (this.engine.rows.indexOf(userName) > -1) {
      this.userName = userName;
      return `Welcome ${userName}!`;
    } else {
      return `Sorry but I do not know of any ${userName}. Maybe you have not been a customer before, or have you misspelt your username?`;
    }
  }
  recommendTerm(term) {
    return "TODO";
  }
  recommendAll() {
    const { recommendations } = this.userName
      ? this.engine.getRecommendationForExisting(this.userName)
      : this.engine.getRecommendationForNew();
    const recommendationsString = recommendations.map(r => r.name).join("\n");
    return recommendationsString;
  }
}

module.exports = Recommender;
