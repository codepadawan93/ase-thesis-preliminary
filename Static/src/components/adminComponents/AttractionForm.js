import React, { Component } from "react";
import counties from "../../data/counties";

class AttractionForm extends Component {
  constructor() {
    super();
    this.state = {
      counties: counties
    };
    console.log(this.state.counties);
  }

  renderCounties() {
    const countyOptions = [];
    countyOptions.push(<option value="">----- none ------</option>);
    for (let key in this.state.counties) {
      console.log(key);
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
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="col-md-4 control-label" htmlFor="county">
                  County
                </label>
                <div className="col-md-4">
                  <select id="county" name="county" className="form-control">
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
                  />
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
                    type="text"
                    placeholder=""
                    className="form-control input-md"
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
                    type="text"
                    placeholder=""
                    className="form-control input-md"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="col-md-10 control-label" htmlFor="rating">
                  Rating
                </label>
                <div className="col-md-10">
                  <label className="radio-inline" htmlFor="rating-0">
                    <input
                      type="radio"
                      name="rating"
                      id="rating-0"
                      value="1"
                      checked="checked"
                    />
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
                  >
                    <option value="SPRING">Spring</option>
                    <option value="SUMMER">Summer</option>
                    <option value="AUTUMN">Autumn</option>
                    <option value="WINTER">Winter</option>
                  </select>
                </div>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    );
  }
}

export default AttractionForm;
