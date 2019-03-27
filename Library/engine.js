const maths = require("./maths");
const TFIDF = require("./tfidf");
const Utils = require("./utils");

class Engine {
  constructor() {
    this.cutoffValue = 0.01;
    this.KEYWORD_LENGTH = 15;
    this.filterBySeason - false;

    // Cache the season rules
    /**
     * Spring runs from March 1 to May 31;
     * Summer runs from June 1 to August 31;
     * Fall (autumn) runs from September 1 to November 30; and
     * Winter runs from December 1 to February 28 (February 29 in a leap year).
     */
    const year = new Date().getFullYear();
    this.seasons = {
      ANY: {
        name: "Any",
        from: new Date(year, 0, 1),
        to: new Date(year, 11, 31)
      },
      SPRING: {
        name: "Spring",
        from: new Date(year, 2, 1),
        to: new Date(year, 4, 31)
      },
      SUMMER: {
        name: "Summer",
        from: new Date(year, 5, 1),
        to: new Date(year, 7, 31)
      },
      AUTUMN: {
        name: "Autumn",
        from: new Date(year, 8, 1),
        to: new Date(year, 10, 30)
      },
      WINTER: {
        name: "Winter",
        from: new Date(year, 8, 1),
        to: new Date(year, 10, 30)
      }
    };
  }

  setFilterBySeason(value) {
    this.filterBySeason = value;
  }

  fit(ratings, items) {
    this.users = [];
    this.ratingsArray = [];
    this.attractionsArray = [];
    this.matrix = [];
    this.colLabels = [];
    this.cols = [];
    this.rows = [];
    this.similarities = [];
    this.recommendations = [];
    this.keywords = {};

    this.ratings = ratings;
    this.items = items;

    // Create the user array and also parse the responses into a usable format
    for (let key in this.ratings) {
      const response = this.ratings[key];
      const individualRatings = response.scores;
      this.users.push({
        userId: key,
        userName: response.userName,
        location: response.location
      });
      for (let score of individualRatings) {
        score.userName = response.userName;
        this.ratingsArray.push(score);
      }
    }
    // parse the attractions as well
    for (let key in this.items) {
      this.attractionsArray.push({
        ...this.items[key],
        attractionFirebaseId: key
      });
    }

    // Create an users * items shaped matrix filled with zeros
    this.matrix = maths.zeros2d(
      this.users.length,
      this.attractionsArray.length
    );

    // Remember the order of columns and rows
    this.colLabels = this.attractionsArray.map(attraction => attraction.name);
    this.cols = this.attractionsArray.map(
      attraction => attraction.attractionId + ""
    );
    this.rows = this.users.map(user => user.userName);

    // And build the users to items matrix
    for (let ratingInstance of this.ratingsArray) {
      const { userName, attractionId, rating } = ratingInstance;
      const i = this.rows.indexOf(userName);
      const j = this.cols.indexOf(attractionId);
      this.matrix[i][j] = rating;
    }

    // Calculate keywords for each attraction too
    this._calculateKeywords();
    return this;
  }

  _getSeason() {
    const date = new Date();
    for (let key in this.seasons) {
      if (key === "ANY") continue;
      if (this.seasons[key].from <= date && date <= this.seasons[key].to) {
        return key;
      }
    }
  }

  _calculateSimilarities() {
    let sumSimilarity = 0;
    // Traverse the matrix row by row and calculate similarity with all other rows
    for (let i = 0; i < this.matrix.length; i++) {
      const a = this.matrix[i];
      const userSimilarity = { userName: this.rows[i], to: [] };
      for (let j = 0; j < this.matrix.length; j++) {
        // do not calculate for self
        if (j === i) {
          continue;
        }
        const b = this.matrix[j];
        const similarity = maths.calculateCosineSimilarity(a, b);

        userSimilarity.to.push({
          userName: this.rows[j],
          similarity: similarity
        });

        sumSimilarity += similarity;
      }
      // sort ascendingly
      userSimilarity.to.sort((a, b) => {
        return b.similarity - a.similarity;
      });

      this.similarities.push(userSimilarity);
    }
    // Cutoff value is the mean similarity
    this.cutoffValue =
      sumSimilarity / (this.matrix.shape()[0] * this.matrix.shape()[1]);
    return this;
  }

  _calculateKeywords() {
    // Iterate over all documents
    for (let i = 0; i < this.attractionsArray.length; i++) {
      const tfidf = new TFIDF();

      const attraction = this.attractionsArray[i];
      const description = Utils.replaceInvalidChars(
        `${attraction.name} ${attraction.county} ${attraction.description}`
      );

      tfidf.termFreq(description);
      let docCount = 0;
      // Iterate again
      for (let j = 0; j < this.attractionsArray.length; j++) {
        // count IDF
        const _attraction = this.attractionsArray[j];
        const _description = Utils.replaceInvalidChars(
          `${_attraction.name} ${_attraction.county} ${_attraction.description}`
        );
        tfidf.docFreq(_description);

        // When we're finished
        docCount++;
        if (docCount === this.attractionsArray.length) {
          // All the probabilities and divs
          tfidf.finish(docCount);
          tfidf.sortByScore();
          docCount = 0;
        }
      }
      const keywords = tfidf.getKeys().slice(0, this.KEYWORD_LENGTH);
      this.attractionsArray[i].keywords = keywords;
      keywords.map(k => {
        // Beautiful type checking js
        if (!Array.isArray(this.keywords[k])) {
          this.keywords[k] = [];
        }
        this.keywords[k].push(this.attractionsArray[i].attractionId);
      });
    }
  }

  getRecommendationForExisting(userName) {
    this._calculateSimilarities();
    const allItems = [];
    const attractionIds = new Set();
    if (this.rows.indexOf(userName) === -1) {
      throw new Error("Unknown user");
    }
    // Get the users most similar to the one provided
    const user = this.similarities
      .filter(similarity => similarity.userName === userName)
      .reduce(similarity => similarity);

    user.to
      .filter(_user => _user.similarity > this.cutoffValue)
      .map(similar => {
        this.ratingsArray
          .filter(rating => rating.userName === similar.userName)
          .map(item => allItems.push(item));
      });

    // sort all recommendations returned by rating
    // Make sure each one appears only once
    allItems
      .sort((a, b) => b.rating - a.rating)
      .map(item => attractionIds.add(parseInt(item.attractionId)));

    // map over recommendations and pull in the needed data
    attractionIds.forEach(attractionId => {
      const item = this.attractionsArray
        .filter(_item => _item.attractionId === attractionId)
        .reduce(_item => _item);
      this.recommendations.push(item);
    });

    if (this.filterBySeason === true) {
      this._filterBySeason();
    }
    return this;
  }

  getRecommendationForNew(ratings) {
    // Add a new user to the data
    const userName = Buffer.from(new Date().getTime() + "").toString("base64");
    ratings.userName = userName;
    this.ratings.NEW_KEY = ratings;

    // fit the model again
    this.fit(this.ratings, this.items)
      ._calculateSimilarities()
      .getRecommendationForExisting(userName);
    return this;
  }

  getRecommendationsByKeyWord(word) {
    if (!word || word.length < 3) {
      return [];
    } else {
      const havingKeyword = this.keywords[word];
      if (havingKeyword && havingKeyword.length > 0) {
        // Get those recommendations that are relevant. Then sort by TFIDF score
        const recommendations = this.attractionsArray
          .filter(
            attraction => havingKeyword.indexOf(attraction.attractionId) > -1
          )
          .sort((a, b) => {
            // If not present in these keywords, assign them a very high score so they go to the bottom
            let rankA = a.keywords.indexOf(word);
            let rankB = b.keywords.indexOf(word);
            if (rankA === -1) {
              rankA = 11;
            }
            if (rankB === -1) {
              rankB = 11;
            }
            return rankA - rankB;
          });
        return recommendations;
      } else {
        return [];
      }
    }
  }
  _filterBySeason() {
    const season = this._getSeason();
    this.recommendations = this.recommendations.filter(_item => {
      return (
        _item.season.indexOf(season) > -1 || _item.season.indexOf("ANY") > -1
      );
    });
    return this;
  }
}

module.exports = Engine;
