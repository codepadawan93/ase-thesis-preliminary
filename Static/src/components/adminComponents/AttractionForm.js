import React, { Component } from "react";
import counties from "../../data/counties";
import seasons from "../../data/seasons";
import toastr from "toastr";
import firebase from "firebase";


class AttractionForm extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.database = firebase.database();
    this.id = this.props.match.params.id;
    this.state = {
      counties: counties,
      seasons: seasons,
      submitted: false,
      firebaseId: null,
      attractionData: {
        name: "",
        county: "",
        description: "",
        image: "",
        latitude: 0.0,
        longitude: 0.0,
        rating: 0,
        address: "",
        season: []
      }
    };
  }
  componentWillMount(){
    if(this.id !== "add"){
      this.populateForm(this.id);
    } 
  }
  renderCounties() {
    const countyOptions = [];
    countyOptions.push(<option value="">----- none ------</option>);
    for (let key in this.state.counties) {
      countyOptions.push(
        <option value={key} selected={this.state.attractionData.county===key}>{this.state.counties[key]}</option>
      );
    }
    return countyOptions;
  }
  render() {
    return (
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <form className="form-horizontal">
            <fieldset>
              <legend>Attraction</legend>

              <div className="form-group">
                <label className="col-md-4 control-label" htmlFor="name">
                  Name
                </label>
                <div className="col-md-4">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder=""
                    className="form-control input-md"
                    value={this.state.attractionData.name}
                    onChange={e => this.handleChange(e)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="col-md-4 control-label" htmlFor="county">
                  County
                </label>
                <div className="col-md-4">
                  <select
                    id="county"
                    name="county"
                    className="form-control"
                    onChange={e => this.handleChange(e)}
                  >
                    {this.renderCounties()}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label
                  className="col-md-10 control-label"
                  htmlFor="description"
                >
                  Description
                </label>
                <div className="col-md-10">
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    onChange={e => this.handleChange(e)}
                    value={this.state.attractionData.description}
                  />
                </div>
              </div>

              <div className="form-group">
                <label
                  className="col-md-10 control-label"
                  htmlFor="description"
                >
                  Image
                </label>
                <div className="col-md-10">
                  <input
                    id="image"
                    name="image"
                    type="text"
                    placeholder=""
                    className="form-control input-md"
                    value={this.state.attractionData.image}
                    onChange={e => this.handleChange(e)}
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="col-md-10">
                  {this.state.attractionData.image ? (
                    <img
                      src={this.state.attractionData.image}
                      alt="no-image"
                      className="img-thumbnail"
                    />
                  ) : null}
                </div>
              </div>

              <div className="form-group">
                <label className="col-md-4 control-label" htmlFor="latitude">
                  Latitude
                </label>
                <div className="col-md-4">
                  <input
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="0.1"
                    placeholder=""
                    className="form-control input-md"
                    onChange={e => this.handleChange(e)}
                    value={this.state.attractionData.latitude}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="col-md-4 control-label" htmlFor="longitude">
                  Longitude
                </label>
                <div className="col-md-4">
                  <input
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="0.1"
                    placeholder=""
                    className="form-control input-md"
                    onChange={e => this.handleChange(e)}
                    value={this.state.attractionData.longitude}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="col-md-10 control-label" htmlFor="rating">
                  Rating
                </label>
                <div className="col-md-10">
                  <input 
                    id="rating" 
                    name="rating" 
                    type="number"
                    readOnly="true"
                    className="form-control input-md"
                    value={this.state.attractionData.rating}
                    />
                </div>
              </div>

              <div className="form-group">
                <label className="col-md-10 control-label" htmlFor="address">
                  Address
                </label>
                <div className="col-md-10">
                  <textarea
                    className="form-control"
                    id="address"
                    name="address"
                    onChange={e => this.handleChange(e)}
                    value={this.state.attractionData.address}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="col-md-4 control-label" htmlFor="season">
                  Season
                </label>
                <div className="col-md-4">
                  <select
                    id="season"
                    name="season"
                    className="form-control"
                    multiple="multiple"
                    onChange={e => this.handleChange(e)}
                  >
                    {this.renderSeasons()}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <button
                  className="btn btn-primary"
                  onClick={e => this.handleSubmit(e)}
                >
                  Submit
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    );
  }
  populateForm = async id => {
    try {
      const snapshot = await this.database.ref("/attractions/" + id).once('value');
      const attraction  = snapshot.val();
      this.setState({...this.state, firebaseId: id, attractionData: {...this.state.attractionData, ...attraction}});
    } catch(err) {
      toastr.error(err);
      console.error(err);
    }
  }
  renderSeasons(){
    const seasonArray = [];
    for(let key in this.state.seasons){
      seasonArray.push(<option value={key} selected={this.state.attractionData.season.includes(key)}>{seasons[key]}</option>);
    }
    return seasonArray;
  }
  handleSubmit = async event => {
    event.preventDefault();
    if(this.state.submitted) return;
    const attraction = this.state.attractionData;
    if(this.validateAttraction(attraction)){
      this.setState({submitted: true});
      try{
        const {
          name,
        county,
        attractionId,
        description,
        image,
        latitude,
        longitude,
        rating,
        address,
        season
        } = attraction;
        let validatedAttraction = {
          name,
          county,
          attractionId,
          description,
          image,
          latitude,
          longitude,
          rating,
          address,
          season
        };
        // we update
        if(this.id !== "add"){
          await this.database.ref("/attractions/" + this.state.firebaseId).update(validatedAttraction);
          toastr.success(`Successfully updated ${attraction.name}!`);
        } else {
          // we add
          // Get the item with highest attraction id and set the new item's id to 1 over that
          const last = await this.database.ref('attractions').orderByChild("attractionId").limitToLast(1).once("value");
          validatedAttraction.attractionId = this.getAttractionId(last);
          await this.database.ref("/attractions").push(validatedAttraction);
          toastr.success(`Successfully added ${attraction.name}!`);
        } 
        this.setState({submitted: false});
      } catch(e){
        toastr.error(e.toString());
      }
    }
  }
  getAttractionId = dataSnapshot => {
    let attractionId = -1;
    const data = dataSnapshot.val();
    for(let key in data){
      attractionId = data[key].attractionId;
    }
    if(attractionId === -1){
      return 1;
    } else {
      return attractionId + 1;
    }
  }
  validateAttraction(attraction){
    let valid = true;
    if(typeof attraction.name !== "string" || attraction.name.length <= 1){
      valid = false;
      toastr.error("Name should exist and have a length of over 1");
    }
    if(typeof attraction.county !== "string" || typeof this.state.counties[attraction.county] === "undefined"){
      valid = false;
      toastr.error("County should be set and be part of the counties of Romania");
    }
    if(typeof attraction.description !== "string" || attraction.description.length <= 1){
      valid = false;
      toastr.error("Description should exist and have a length of over 1");
    }
    if(typeof attraction.address !== "string" || attraction.address.length <= 1){
      valid = false;
      toastr.error("Address should be set and have a length of over 1");
    }
    if(attraction.season.length < 1){
      valid = false;
      toastr.error("Attraction should have at least one season during which it can be visited");
    }
    if(typeof parseFloat(attraction.latitude) !== "number"){
      valid = false;
      toastr.error("Latitude should be a number");
    }
    if(typeof parseFloat(attraction.longitude) !== "number"){
      valid = false;
      toastr.error("Longitude should be a number");
    }
    if(typeof parseFloat(attraction.rating) !== "number"){
      valid = false;
      toastr.error("Rating should be a number");
    }
    return valid;
  }
  handleChange(event) {
    const target = event.target;
    let value;
    if (target.name === "season") {
      const selected = [];
      for (let option of event.target.options) {
        if (option.selected) {
          selected.push(option.value);
        }
      }
      value = selected;
    } else {
      value = target.value;
    }
    this.setState({
      attractionData: {
        ...this.state.attractionData,
        [target.name]: value
      }
    });
  }
}

export default AttractionForm;
