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
            attractionData: null,

        };
    }
    render(){
        return <h2>{JSON.stringify(this.state.attractionData)}</h2>;
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
}

export default AttractionView;