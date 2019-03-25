const fs = require("fs");
const Engine = require("./engine");
const Utils = require("./utils");

class Recommender {
  constructor(firebaseRef) {
    this.engine = new Engine();
    this.userName = null;

    // refactor...
    this.responsesRef = firebaseRef.child("responses");
    this.attractionsRef = firebaseRef.child("attractions");
  }

  static async getInstance(ref) {
    // Do all the async stuff
    const ret = new Recommender(ref);
    const responses = await ret.responsesRef.once("value");
    const attractions = await ret.attractionsRef.once("value");
    ret.responses = responses.val();
    ret.attractions = attractions.val();

    // Then build the model
    ret.engine.fit(ret.responses, ret.attractions);
    return ret;
  }

  parse(event) {
    // interpret the event and get the value
    const parts = event.split(/=/);
    const type = parts[0];
    let term = parts[1] || "";
    term = Utils.replaceInvalidChars(term);
   
    // Respond differently as a function of the event type
    switch (type) {
      case "expression.attribution.username":
        return this.setUserName(term);

      case "query.recommend.term":
        return "TODO";

      case "query.recommend.all":
        return this.recommendAll();

      case "query.attractions.term":
        return this.recommendTerm(term);

      case "query.inform.term":
        return this.informTerm(term);

      case "query.image.term":
        return "TODO";

      case "query.category.term":
        return this.informCategoryByTerm(term);

      case "query.map.term":
        return this.getMapByTerm(term);

      case "query.season.term":
        return this.getSeasonByTerm(term);

      default:
        // by default the event is just a natural language reply
        return event;
    }
  }

  
  setUserName(userName) {
    // Sets the user name of the user. This is bad because it basically
    // limits the number of sessions to only one. Similarly the user is
    // only set from here - not from login. This will have to be refactored
    // somehow
    const rows = this.engine.rows.map(name => name.toLowerCase());
    if (rows.indexOf(userName) > -1) {
      this.userName = userName;
      return `Welcome ${userName}!`;
    } else {
      return `Sorry but I do not know of any ${userName}. Maybe you have not been a customer before, or have you misspelt your username?`;
    }
  }
  
  getSeasonByTerm(term){
    let recommendations = this.engine.getRecommendationsByKeyWord(term);
    if (recommendations.length > 0) {
      return `You can visit ${recommendations[0].name} during ` + recommendations[0].season.map(s => s.toLowerCase()).join(", ");
    } else {
      recommendations = this.engine.attractionsArray.filter(
        attraction => attraction.category.includes(term)
      );
    }
    if (recommendations.length > 0) {
      return `You can visit ${recommendations[0].name} during ` + recommendations[0].season.map(s => s.toLowerCase()).join(", ");
    } else {
      return `I found no relevant data on ${term}`;
    }
  }

  getMapByTerm(term){
    let recommendations = this.engine.getRecommendationsByKeyWord(term);
    if (recommendations.length > 0) {
      const rec = recommendations[0];
      return `https://maps.google.com/maps?q=${rec.latitude},${rec.longitude}&hl=en&z=9&output=embed`;
    } else {
      recommendations = this.engine.attractionsArray.filter(
        attraction => attraction.category.includes(term)
      );
    }
    if (recommendations.length > 0) {
      const rec = recommendations[0];
      return `https://maps.google.com/maps?q=${rec.latitude},${rec.longitude}&hl=en&z=9&output=embed`;;
    } else {
      return `I found no relevant data on ${term}`;
    }
  }

  informCategoryByTerm(term){
    let recommendations = this.engine.getRecommendationsByKeyWord(term);
    if (recommendations.length > 0) {
      return recommendations[0].category;
    } else {
      recommendations = this.engine.attractionsArray.filter(
        attraction => attraction.name.includes(term) || attraction.description.includes(term)
      );
    }
    if (recommendations.length > 0) {
      return recommendations[0].category;
    } else {
      return `I found no relevant data on ${term}`;
    }
  }

  recommendTerm(term) {
    // Get a list of recommendations from the engine
    let recommendations = this.engine.getRecommendationsByKeyWord(term);
    let recommendationsString = "";
    if (recommendations.length > 0) {
      recommendationsString = recommendations
        .map(r => r.name)
        .slice(0, 10)
        .join("\n");
    } else {
      recommendationsString = `Sorry, I found no matching attractions for term ${term}`;
    }
    return recommendationsString;
  }

  informTerm(term) {
    let recommendations = this.engine.getRecommendationsByKeyWord(term);
    if (recommendations.length > 0) {
      return recommendations[0].description;
    } else {
      recommendations = this.engine.attractionsArray.filter(
        attraction =>
          attraction.name.includes(term) ||
          attraction.description.includes(term)
      );
    }
    if (recommendations.length > 0) {
      return recommendations[0].description;
    } else {
      return `I found no relevant data on ${term}`;
    }
  }

  recommendAll() {
    const { recommendations } = this.userName
      ? this.engine.getRecommendationForExisting(this.userName)
      : this.engine.getRecommendationForNew({});
    const recommendationsString = recommendations
      .map(r => r.name)
      .slice(0, 10)
      .join("\n");
    return recommendationsString;
  }
}

module.exports = Recommender;
