import React, { Component } from "react";
import counties from "../../data/counties";

class AttractionForm extends Component {
  constructor() {
    super();
    this.state = {
      counties: counties,
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

  renderCounties() {
    const countyOptions = [];
    countyOptions.push(<option value="">----- none ------</option>);
    for (let key in this.state.counties) {
      countyOptions.push(
        <option value={key}>{this.state.counties[key]}</option>
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
                    value={this.state.attractionData.county}
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
                  >
                    {this.state.attractionData.description}
                  </textarea>
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
                  <label className="radio-inline" htmlFor="rating-0">
                    <input type="radio" name="rating" id="rating-0" value="1" />
                    1
                  </label>
                  <label className="radio-inline" htmlFor="rating-1">
                    <input type="radio" name="rating" id="rating-1" value="2" />
                    2
                  </label>
                  <label className="radio-inline" htmlFor="rating-2">
                    <input type="radio" name="rating" id="rating-2" value="3" />
                    3
                  </label>
                  <label className="radio-inline" htmlFor="rating-3">
                    <input type="radio" name="rating" id="rating-3" value="4" />
                    4
                  </label>
                  <label className="radio-inline" htmlFor="rating-4">
                    <input type="radio" name="rating" id="rating-4" value="5" />
                    5
                  </label>
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
                  >
                    {this.state.attractionData.address}
                  </textarea>
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
                    <option value="ANY">Any</option>
                    <option value="SPRING">Spring</option>
                    <option value="SUMMER">Summer</option>
                    <option value="AUTUMN">Autumn</option>
                    <option value="WINTER">Winter</option>
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
  handleSubmit(event) {
    event.preventDefault();
    console.log(this.state.attractionData.season);
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
