import React, { Component } from "react";
import { Link } from "react-router-dom";
import logo from "../theme/img/your_next_vacation.png";
import firebase from "firebase";
import toastr from "toastr";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      currentUser: null,
      errors: [],
      messages: []
    };
  }
  componentWillMount = async () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          currentUser: user
        });
      }
    });
  };
  handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      this.setState({
        ...this.state,
        currentUser: null,
        messages: ["Logged out"]
      });
    } catch (err) {
      this.setErrors([`${err.code} : ${err.message}`]);
    }
  };
  setErrors = errors => {
    this.setState({ errors });
  };
  setMessages = messages => this.setState({ messages });
  showMessages = () =>
    this.state.messages.forEach(e => {
      toastr.success(e);
    });
  showErrors = () => {
    this.state.errors.forEach(e => {
      toastr.error(e);
    });
  };
  render() {
    this.showErrors();
    this.showMessages();
    return (
      <nav className="navbar navbar-light bg-light static-top">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img src={logo} width="35" height="35" alt="" className="mr-3" />
            Your next vacation
          </Link>
          {this.state.currentUser ? (
            <div>
              <span className="navbar-text">
                {`Welcome, ${this.state.currentUser.email.split(/@/)[0]}!`}
              </span>
              <button
                className="btn btn-secondary"
                onClick={e => this.handleLogout()}
              >
                Sign out
              </button>
              <Link className="btn btn-primary" to="/browse-attractions">
                Browse attractions
              </Link>
              {this.state.currentUser.uid === "ACm5e6uGbvSjHmxGam3Ic7f9IAj1" ? <Link className="btn btn-primary" to="/admin">Admin</Link> : null}
            </div>
          ) : (
            <Link className="btn btn-primary" to="/sign-in">
              Sign in
            </Link>
          )}
        </div>
      </nav>
    );
  }
}

export default Navbar;
