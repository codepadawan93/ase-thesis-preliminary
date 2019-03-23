import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import firebase from "firebase";
import toastr from "toastr";

class BrowseAttractions extends Component {
  REQUIRED_SCORES = 15;
  constructor() {
    super();
    this.database = firebase.database();
    this.currentRef = React.createRef();
    this.state = {
      position: [],
      currentUser: null,
      attractions: [],
      displayAttractions: [],
      scores: [],
      scoreStates: {},
      search: {
        searchNrCrt: "",
        searchName: "",
        searchDescription: ""
      },
      shouldRedirect: false
    };
  }
  
  render() {
    return (
      <div className="row">
        <div className="col-md-10 offset-md-1">
          {this.renderScoresMessage()}
          <h1 ref={this.currentRef} className="panel">
            Complete your survey
          </h1>
          <table className="table table-hover panel">
            <thead>
              <tr>
                <th>
                  <input
                    className="form-control"
                    placeholder="Nr. Crt"
                    name="searchNrCrt"
                    onChange={e => this.handleChange(e)}
                    value={this.state.search.nrCrt}
                  />
                </th>
                <th>
                  <input
                    className="form-control"
                    placeholder="Name"
                    name="searchName"
                    onChange={e => this.handleChange(e)}
                    value={this.state.search.name}
                  />
                </th>
                <th>
                  <input
                    className="form-control"
                    placeholder="Description"
                    name="searchDescription"
                    onChange={e => this.handleChange(e)}
                    value={this.state.search.description}
                  />
                </th>
                <th />
              </tr>
            </thead>
            <thead>
              <tr>
                <th width="8%">#</th>
                <th width="20%">Name</th>
                <th width="60%">Description</th>
                <th width="12%">Your rating</th>
              </tr>
            </thead>
            <tbody>{this.renderItems()}</tbody>
          </table>
          {this.renderToolbox()}
          {this.state.shouldRedirect ? <Redirect to="/thank-you" /> : null}
        </div>
      </div>
    );
  }
  componentWillMount() {
    this.fetchItems();
    this.setLocation();
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const userName = user.email.split(/@/gi)[0];
        this.setState({ ...this.state, currentUser: user, userName });
      }
    });
  }
  renderItems = () => {
    return this.state.displayAttractions.map((attraction, i) => {
      if (!attraction) {
        return;
      }
      return (
        <tr key={attraction.firebaseId}>
          <td>{attraction.attractionId}</td>
          <td>
              <Link to={`/browse-attractions/${attraction.firebaseId}`}>
            {attraction.name.length >= 80
              ? attraction.name.substring(0, 80) + "..."
              : attraction.name}
              </Link>
          </td>
          <td>
            {attraction.description.length >= 180
              ? attraction.description.substring(0, 180) + "..."
              : attraction.description}
          </td>
          <td className="rating-stars">{this.renderStars(attraction.attractionId)}</td>
        </tr>
      );
    });
  };
  fetchItems = async () => {
    try {
      const dataSnapshot = await this.database.ref("attractions").once("value");
      const items = dataSnapshot.val();
      const attractions = [];
      for (let key in items){
          const attraction = items[key];
          attraction.firebaseId = key;
          attractions.push(attraction);
      }  
      this.setState({
        ...this.state,
        attractions: attractions,
        displayAttractions: attractions
      });
    } catch (e) {
      toastr.error(`Error has occurred: ${e}`);
    }
  };
  handleClick = async e => {
    e.preventDefault();
    if (true || this.validateScores()) {
      const { latitude, longitude } = this.state.position;
      const data = {
        location: { latitude, longitude },
        userName: this.state.userName,
        scores: this.state.scores
      };
      try {
        // send data to firebase
        const dataSnapshot = await this.database.ref("responses")
          .orderByChild('userName')
          .equalTo(this.state.userName)
          .once("value");
        const response = dataSnapshot.val();
        if(response){
          // Get the sys id and merge the two objects...
          const id = this.getFirebaseId(response);
          const fields = response[id];
          fields.scores = [...fields.scores, ...data.scores];
          if(!fields.location && data.location){
            fields.location = data.location;
          }
          await this.database.ref(`responses/${id}`).update(fields);
        } else {
          // new response then
          await this.database.ref("responses").push(data);
        }
        toastr.success("Response has been submitted!");
      } catch (e) {
        toastr.error(`An error has occurred: ${e}`);
      }
    } else {
      toastr.warning("Please fill in at least 15 responses!");
    }
  };

  getFirebaseId(response){
    let id = null;
    for(let key in response){
      id = key;
    }
    if(id){
      return id;
    } else {
      throw new Error("Invalid dataSnapshot value provided");
    }
  }

  handleChange = e => {
    const { value, name } = e.target;
    this.setState({ search: { ...this.state.search, [name]: value } });
    let property = name.replace("search", "").toLowerCase();
    if (name === "searchNrCrt") {
      property = "attractionId";
    }
    if (value !== "") {
      this.setState({
        displayAttractions: this.state.attractions.filter(
          attraction =>
            attraction && new RegExp(value, "gi").test(attraction[property])
        )
      });
    } else {
      this.setState({
        displayAttractions: this.state.attractions
      });
    }
  };
  setLocation = () => {
    const context = this;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        context.setState({ position: position.coords });
      });
    }
  };
  validateScores = () => {
    return this.state.scores.length >= 15;
  };
  handleRate = (id, rating) => {
    rating /= 5;
    const newScoreStates = this.state.scoreStates;
    newScoreStates[id] = rating;
    this.setState({
      scoreStates: newScoreStates
    });
    const score = {
      attractionId: id,
      rating
    };

    // Do not allow duplicates. Update the existing record if exists
    this.setState({
      scores: [
        ...this.state.scores.filter(_score => _score.attractionId !== id),
        score
      ]
    });
  };
  updateScore = (e, i) => {
    const rating = e.nativeEvent.offsetX / e.nativeEvent.target.offsetWidth;
    const innerStars = e.target.children[0] ? e.target.children[0] : e.target;
    const newScoreStates = this.state.scoreStates;
    newScoreStates[i] = Math.ceil(rating * 100);
    this.setState({
      scoreStates: newScoreStates
    });
    const score = {
      attractionId: i,
      rating
    };

    // Do not allow duplicates. Update the existing record if exists
    this.setState({
      scores: [
        ...this.state.scores.filter(_score => _score.attractionId !== i),
        score
      ]
    });
  };
  scrollToTop = ref => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };
  renderScoresMessage = () => {
    const retval = (
      <div
        className={`scores-message alert alert-${
          this.REQUIRED_SCORES - this.state.scores.length <= 0
            ? "success"
            : "primary"
        }`}
      >
        {this.REQUIRED_SCORES - this.state.scores.length > 0 ? (
          <div>
            You still have to rate
            <strong>
              {" " + (this.REQUIRED_SCORES - this.state.scores.length)} out of
              {" " + this.REQUIRED_SCORES + " "}
            </strong>
            items.
          </div>
        ) : (
          <div>You can submit!</div>
        )}
      </div>
    );
    return retval;
  };
  renderToolbox = () => {
    return (
      <div className="container-fluid toolbox">
        <div className="row">
          <div className="col-md-3 col-sm-12">
            <div className="card">
              <div className="card-body">
               <button
                  className="btn btn-primary"
                  onClick={e => this.handleClick(e)}
                >
                  Submit
                </button>
                <button
                  className="btn btn-secondary float-right"
                  onClick={() => this.scrollToTop(this.currentRef)}
                >
                  Go to top
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  renderStars = id => {
    // Pretty bad but werks well enough
    return [1, 2, 3, 4, 5].map(j => {
      const currentScore = this.state.scoreStates[id];
      let starClass = "far fa-star";
      if (currentScore && currentScore * 5 >= j) {
        starClass = "fas fa-star golden";
      }
      return (
        <i
          className={starClass}
          key={id + "." + j}
          onClick={e => this.handleRate(id, j)}
        />
      );
    });
  };
}

export default BrowseAttractions;