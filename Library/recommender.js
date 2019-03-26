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
    
    // Either filter by season or dont
    ret.engine.setFilterBySeason(true);
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
        return this.getDataTerm(term);

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

  getDataTerm(term){
    let recommendations = this.engine.getRecommendationsByKeyWord(term);
    if (recommendations.length > 0) {
      const rec = recommendations[0];
      return `${rec.name}\n${rec.season.join(", ")}\n${rec.category}\n${rec.latitude},${rec.longitude}`;
    } else {
      recommendations = this.engine.attractionsArray.filter(
        attraction => attraction.category.includes(term)
      );
    }
    if (recommendations.length > 0) {
      return `${rec.name}\n${rec.season.join(", ")}\n${rec.category}\n${rec.latitude},${rec.longitude}`;
    } else {
      return `I found no relevant data on ${term}`;
    }
  }

  getMapByTerm(term){
    let recommendations = this.engine.getRecommendationsByKeyWord(term);
    recommendations = recommendations.filter(r => r.latitude !== 0 && r.longitude !== 0);
    if (recommendations.length > 0) {
      const rec = recommendations[0];
      return `https://maps.google.com/maps?q=${rec.latitude},${rec.longitude}&hl=en&z=9`;
    } else {
      recommendations = this.engine.attractionsArray.filter(
        attraction => attraction.category.includes(term) && attraction.latitude !== 0 && attraction.longitude !== 0
      );
    }
    if (recommendations.length > 0) {
      const rec = recommendations[0];
      return `https://maps.google.com/maps?q=${rec.latitude},${rec.longitude}&hl=en&z=9`;;
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
    const testData = {
      "scores" : [ {
        "attractionId" : "15",
        "rating" : 1
      }, {
        "attractionId" : "16",
        "rating" : 1
      }, {
        "attractionId" : "17",
        "rating" : 1
      }, {
        "attractionId" : "21",
        "rating" : 1
      }, {
        "attractionId" : "31",
        "rating" : 1
      }, {
        "attractionId" : "32",
        "rating" : 1
      }, {
        "attractionId" : "34",
        "rating" : 1
      }, {
        "attractionId" : "35",
        "rating" : 1
      }, {
        "attractionId" : "36",
        "rating" : 1
      }, {
        "attractionId" : "38",
        "rating" : 1
      }, {
        "attractionId" : "56",
        "rating" : 1
      }, {
        "attractionId" : "60",
        "rating" : 1
      }, {
        "attractionId" : "66",
        "rating" : 1
      }, {
        "attractionId" : "141",
        "rating" : 1
      }, {
        "attractionId" : "142",
        "rating" : 1
      }, {
        "attractionId" : "146",
        "rating" : 1
      }, {
        "attractionId" : "151",
        "rating" : 1
      }, {
        "attractionId" : "152",
        "rating" : 1
      }, {
        "attractionId" : "153",
        "rating" : 1
      }, {
        "attractionId" : "154",
        "rating" : 1
      }, {
        "attractionId" : "175",
        "rating" : 1
      }, {
        "attractionId" : "176",
        "rating" : 1
      }, {
        "attractionId" : "187",
        "rating" : 1
      }, {
        "attractionId" : "188",
        "rating" : 1
      }, {
        "attractionId" : "190",
        "rating" : 1
      }, {
        "attractionId" : "208",
        "rating" : 1
      }, {
        "attractionId" : "230",
        "rating" : 1
      }, {
        "attractionId" : "232",
        "rating" : 1
      }, {
        "attractionId" : "235",
        "rating" : 1
      }, {
        "attractionId" : "262",
        "rating" : 1
      }, {
        "attractionId" : "263",
        "rating" : 1
      }, {
        "attractionId" : "264",
        "rating" : 1
      }, {
        "attractionId" : "284",
        "rating" : 1
      }, {
        "attractionId" : "334",
        "rating" : 1
      }, {
        "attractionId" : "335",
        "rating" : 1
      }, {
        "attractionId" : "336",
        "rating" : 1
      }, {
        "attractionId" : "352",
        "rating" : 1
      }, {
        "attractionId" : "353",
        "rating" : 1
      }, {
        "attractionId" : "354",
        "rating" : 1
      }, {
        "attractionId" : "355",
        "rating" : 1
      }, {
        "attractionId" : "357",
        "rating" : 1
      }, {
        "attractionId" : "361",
        "rating" : 1
      }, {
        "attractionId" : "391",
        "rating" : 1
      }, {
        "attractionId" : "402",
        "rating" : 1
      }, {
        "attractionId" : "406",
        "rating" : 1
      }, {
        "attractionId" : "407",
        "rating" : 1
      }, {
        "attractionId" : "408",
        "rating" : 1
      }, {
        "attractionId" : "409",
        "rating" : 1
      }, {
        "attractionId" : "410",
        "rating" : 1
      }, {
        "attractionId" : "412",
        "rating" : 1
      }, {
        "attractionId" : "413",
        "rating" : 1
      }, {
        "attractionId" : "419",
        "rating" : 1
      }, {
        "attractionId" : "450",
        "rating" : 1
      }, {
        "attractionId" : "463",
        "rating" : 1
      }, {
        "attractionId" : "485",
        "rating" : 1
      }, {
        "attractionId" : "487",
        "rating" : 1
      }, {
        "attractionId" : "489",
        "rating" : 1
      }, {
        "attractionId" : "495",
        "rating" : 1
      }, {
        "attractionId" : "502",
        "rating" : 1
      }, {
        "attractionId" : "506",
        "rating" : 1
      }, {
        "attractionId" : "507",
        "rating" : 1
      }, {
        "attractionId" : "508",
        "rating" : 1
      }, {
        "attractionId" : "509",
        "rating" : 1
      }, {
        "attractionId" : "511",
        "rating" : 1
      }, {
        "attractionId" : "522",
        "rating" : 1
      }, {
        "attractionId" : "521",
        "rating" : 1
      }, {
        "attractionId" : "524",
        "rating" : 1
      }, {
        "attractionId" : "526",
        "rating" : 1
      }, {
        "attractionId" : "535",
        "rating" : 1
      }, {
        "attractionId" : "547",
        "rating" : 1
      }, {
        "attractionId" : "548",
        "rating" : 1
      }, {
        "attractionId" : "549",
        "rating" : 1
      }, {
        "attractionId" : "550",
        "rating" : 1
      }, {
        "attractionId" : "561",
        "rating" : 1
      }, {
        "attractionId" : "562",
        "rating" : 1
      }, {
        "attractionId" : "566",
        "rating" : 1
      }, {
        "attractionId" : "638",
        "rating" : 1
      }, {
        "attractionId" : "639",
        "rating" : 1
      }, {
        "attractionId" : "640",
        "rating" : 1
      }, {
        "attractionId" : "641",
        "rating" : 1
      }, {
        "attractionId" : "643",
        "rating" : 1
      }, {
        "attractionId" : "644",
        "rating" : 1
      }, {
        "attractionId" : "654",
        "rating" : 1
      }, {
        "attractionId" : "656",
        "rating" : 1
      }, {
        "attractionId" : "658",
        "rating" : 1
      }, {
        "attractionId" : "659",
        "rating" : 1
      }, {
        "attractionId" : "663",
        "rating" : 1
      }, {
        "attractionId" : "668",
        "rating" : 1
      }, {
        "attractionId" : "675",
        "rating" : 1
      }, {
        "attractionId" : "677",
        "rating" : 1
      }, {
        "attractionId" : "683",
        "rating" : 1
      }, {
        "attractionId" : "691",
        "rating" : 1
      }, {
        "attractionId" : "719",
        "rating" : 1
      }, {
        "attractionId" : "720",
        "rating" : 1
      }, {
        "attractionId" : "727",
        "rating" : 1
      }, {
        "attractionId" : "756",
        "rating" : 1
      }, {
        "attractionId" : "758",
        "rating" : 1
      }, {
        "attractionId" : "804",
        "rating" : 1
      }, {
        "attractionId" : "843",
        "rating" : 1
      }, {
        "attractionId" : "844",
        "rating" : 1
      }, {
        "attractionId" : "901",
        "rating" : 1
      }, {
        "attractionId" : "903",
        "rating" : 1
      }, {
        "attractionId" : "943",
        "rating" : 1
      }, {
        "attractionId" : "947",
        "rating" : 1
      }, {
        "attractionId" : "948",
        "rating" : 1
      }, {
        "attractionId" : "957",
        "rating" : 1
      }, {
        "attractionId" : "966",
        "rating" : 1
      }, {
        "attractionId" : "1053",
        "rating" : 1
      }, {
        "attractionId" : "1054",
        "rating" : 1
      }, {
        "attractionId" : "1057",
        "rating" : 1
      }, {
        "attractionId" : "1059",
        "rating" : 1
      }, {
        "attractionId" : "1060",
        "rating" : 1
      }, {
        "attractionId" : "1061",
        "rating" : 1
      }, {
        "attractionId" : "1066",
        "rating" : 1
      }, {
        "attractionId" : "1067",
        "rating" : 1
      }, {
        "attractionId" : "1068",
        "rating" : 1
      }, {
        "attractionId" : "1069",
        "rating" : 1
      }, {
        "attractionId" : "1070",
        "rating" : 1
      }, {
        "attractionId" : "1071",
        "rating" : 1
      }, {
        "attractionId" : "1072",
        "rating" : 1
      }, {
        "attractionId" : "1081",
        "rating" : 1
      }, {
        "attractionId" : "1101",
        "rating" : 1
      }, {
        "attractionId" : "1106",
        "rating" : 1
      }, {
        "attractionId" : "1130",
        "rating" : 1
      }, {
        "attractionId" : "1131",
        "rating" : 1
      }, {
        "attractionId" : "1141",
        "rating" : 1
      }, {
        "attractionId" : "1159",
        "rating" : 1
      }, {
        "attractionId" : "1172",
        "rating" : 1
      }, {
        "attractionId" : "1189",
        "rating" : 1
      }, {
        "attractionId" : "1228",
        "rating" : 1
      }, {
        "attractionId" : "1231",
        "rating" : 1
      } 
    ]};
    const { recommendations } = this.userName
      ? this.engine.getRecommendationForExisting(this.userName)
      : this.engine.getRecommendationForNew(testData);
    if(recommendations.length > 0){
      return recommendations
        .map(r => r.name)
        .slice(0, 10)
        .join("\n");
    } else {
      return "I have no suggestions for you";
    }
  }
}

module.exports = Recommender;
