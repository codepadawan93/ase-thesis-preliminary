import React, { Component } from "react";
import firebase from "firebase";
import toastr from "toastr";


class AttractionView extends Component {
    constructor(props){
        super(props);
        this.props = props;
        this.database = firebase.database();
        this.state = {
            firebaseId: this.props.match.params.id || null,
            tabActive: "description",
            attractionData: {
              name: "",
              season: []
            }
        };
    }
    render(){
        return (
        <div className="container">
          <div className="row">
            <div className="col-md-7">
                <h1>{this.state.attractionData.name}</h1>
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item">
                  <a className={`nav-link ${this.state.tabActive === "description" ? "active" : ""}`} id="description-tab" onClick={e => this.handleTabClick(e)}>Description</a>
                </li>
                <li className="nav-item">
                  <a className={`nav-link ${this.state.tabActive === "address" ? "active" : ""}`} id="address-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false" onClick={e => this.handleTabClick(e)}>Address</a>
                </li>
                <li className="nav-item">
                  <a className={`nav-link ${this.state.tabActive === "facts" ? "active" : ""}`} id="facts-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false" onClick={e => this.handleTabClick(e)}>Facts</a>
                </li>
              </ul>
              <div className="tab-content">
                { this.state.tabActive === "description" ? 
                <div className="tab-pane fade show active">
                  <p>{this.state.attractionData.description}</p>
                  <p>Best to visit in: {this.state.attractionData.season.map(e => <span className="badge badge-pill badge-primary">{e}</span>)}</p>
                  </div> : null }
                { this.state.tabActive === "address" ? <div className="tab-pane fade show active"><p>{this.state.attractionData.address}</p></div> : null }
                { this.state.tabActive === "facts" ? <div className="tab-pane fade show active">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center">Attraction ID: 
                    <span className="badge badge-primary badge-pill">{this.state.attractionData.attractionId}</span></li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">Category:  
                    <span className="badge badge-primary badge-pill">{this.state.attractionData.category}</span></li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">County: 
                    <span className="badge badge-primary badge-pill">{this.state.attractionData.county}</span></li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">Latitude: 
                    <span className="badge badge-primary badge-pill">{this.state.attractionData.latitude}</span></li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">Longitude: 
                    <span className="badge badge-primary badge-pill">{this.state.attractionData.longitude}</span></li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">Average rating: 
                    <span className="badge badge-primary badge-pill">{this.state.attractionData.rating}</span></li>
                </ul>
                </div> : null }
              </div>
            </div>
            <div className="col-md-5">
            {
              this.state.attractionData.latitude && this.state.attractionData.longitude ?
            <iframe className="map-frame" src={`https://maps.google.com/maps?q=${this.state.attractionData.latitude},${this.state.attractionData.longitude}&hl=en&z=9&output=embed`}></iframe> :
            null
            }
            </div>
          </div>
        </div>);
    }
    componentWillMount = async () => {
        const id = this.state.firebaseId;
        try {
            const snapshot = await this.database.ref("/attractions/" + id).once('value');
            const attraction  = snapshot.val();
            this.setState({...this.state, firebaseId: id, attractionData: {...this.state.attractionData, ...attraction}});
        } catch(err) {
            toastr.error(err);
            console.error(err);
        }
    }
    handleTabClick = e => {
      e.preventDefault();
      const paneId = e.target.id.replace('-tab', '');
      this.setState({tabActive: paneId});
    }
}

export default AttractionView;