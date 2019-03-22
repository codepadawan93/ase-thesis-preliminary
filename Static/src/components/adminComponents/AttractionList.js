import React, { Component } from "react";
import FloatingActionButton from "./FloatingActionButton";
import { Link } from "react-router-dom";
import { request, methods } from "../../helpers/HttpHelper";
import firebase from "firebase";

class AttractionList extends Component {
  constructor(props) {
    super(props);
    this.database = firebase.database();
    this.props = props;
    this.state = {
      items: [],
      errors: [],
      messages: []
    };
  }
  render() {
    return (
      <div className="col-md-10 offset-md-2">
        <FloatingActionButton
          icon="fa-plus"
          type="secondary"
          to="/admin/attractions/add"
        />
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>County</th>
              <th>Address</th>
              <th>Description</th>
              <th>Rating</th>
              <th />
            </tr>
          </thead>
          <tbody>{this.renderItems()}</tbody>
        </table>
      </div>
    );
  }
  async componentDidMount() {
    try {
      const attractionRef = firebase.database().ref('attractions')
      attractionRef.on('value', snapshot => {
        const attractions = snapshot.val();
        const attractionArray = [];
        for(let key in attractions){
          const attraction = attractions[key];
          attraction.firebaseId = key;
          attractionArray.push(attraction);
        }
        this.setState({items: attractionArray});
      });
    } catch (e) {
      this.setErrors([e.toString()]);
    }
  }
  renderItems = () => {
    return this.state.items.map((item, itemKey) => {
      return (
        <tr key={item.firebaseId}>
          <td>{itemKey + 1}</td>
          <td>{item.name.substring(0, 25)}</td>
          <td>{item.county}</td>
          <td>{item.address}</td>
          <td>{item.description.substring(0, 80)}</td>
          <td>{item.rating}</td>
          <td>
            <Link
              to={`/admin/attractions/${item.firebaseId}`}
              className="btn btn-warning btn-item btn-sm text-white"
            >
              <i className="fa fa-edit" />
            </Link>
            <button
              className="btn btn-danger btn-item btn-sm text-white"
              onClick={e => this.handleDeleteItem(item.firebaseId)}
            >
              <i className="fa fa-trash" />
            </button>
          </td>
        </tr>
      );
    });
  };
  handleDeleteItem = id => {
    if (window.confirm(`Are you sure you want to delete list ${id}?`)) {
      this.setState({
        items: this.state.items.filter(item => item.list_id !== id)
      });
      alert("TODO!!!");
    }
  };

  setErrors = errors => {
    this.setState({ errors });
    setTimeout(this.resetErrors, this.ERROR_TIMEOUT);
  };

  resetErrors = () => {
    this.setState({ errors: [] });
  };

  showErrors = () => {
    return this.state.errors.map((error, itemKey) => {
      console.log(error);
    });
  };
}

export default AttractionList;
