import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import toastr from "toastr";
import firebase from "firebase";

class SignIn extends Component {
  constructor() {
    super();
    this.state = {
      currentUser: null,
      userData: {
        userName: "",
        pass: ""
      },
      errors: [],
      messages: [],
      shouldRedirect: false,
      submitted: false,
      redirectTo: "/"
    };
  }

  render() {
    this.showErrors();
    return (
      <div>
        {this.state.shouldRedirect ? (
          <Redirect to={this.state.redirectTo} />
        ) : null}
        <div className="container-fluid">
          <div className="col-md-8 offset-md-2">
            <form>
              <h2>Sign in</h2>
              <div className="form-group row">
                <label htmlFor="userName" className="col-md-2 col-form-label">
                  Username:{" "}
                </label>
                <div className="col-md-10">
                  <input
                    type="text"
                    name="userName"
                    className="form-control"
                    value={this.state.userData.userName}
                    onChange={e => this.updateUserData(e)}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="pass" className="col-md-2 col-form-label">
                  Password:{" "}
                </label>
                <div className="col-md-10">
                  <input
                    type="password"
                    name="pass"
                    className="form-control"
                    value={this.state.userData.pass}
                    onChange={e => this.updateUserData(e)}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-2">
                  <Link className="btn btn-secondary" to="/sign-up">
                    Sign up
                  </Link>
                </div>
                <div className="col-md-2">
                  <button
                    id="btn_login"
                    className="btn btn-primary"
                    onClick={e => this.handleSubmit(e)}
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </form>
            <hr />
            <div className="row">
              <div className="col-md-12">
                <Link to="/" className="btn btn-primary">
                  <i className="fa fa-chevron-left" aria-hidden="true" />
                  &nbsp;Back
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(function() {
        this.setState({ currentUser: null });
      })
      .catch(function(err) {
        this.setErrors([`${err.code} : ${err.message}`]);
      });
  };

  componentWillMount = () => {
    const user = firebase.auth().currentUser;
    if (user) {
      this.setState({
        ...this.state,
        currentUser: user,
        shouldRedirect: true
      });
    }
  };

  handleSubmit = async e => {
    e.preventDefault();
    if (this.validateUser()) {
      const { userName, pass } = this.state.userData;
      try {
        const result = await firebase
          .auth()
          .signInWithEmailAndPassword(userName, pass);
        if (result.user) {
          this.setState({
            ...this.state,
            currentUser: result.user,
            shouldRedirect: true
          });
        } else {
          this.setErrors(["No user signed in"]);
        }
      } catch (err) {
        this.setErrors([`${err.code} : ${err.message}`]);
      }
    }
  };

  validateUser() {
    const { userName, pass } = this.state.userData;
    let errors = [];
    let valid = true;
    if (userName === "") {
      errors.push("Username must be filled out!");
      valid = false;
    }
    if (pass === "" || pass.length < 6) {
      errors.push("the password shoud exist and be at least 6 characters long");
      valid = false;
    }
    this.setErrors(errors);
    return valid;
  }

  updateUserData = e => {
    this.setState({
      userData: { ...this.state.userData, [e.target.name]: e.target.value }
    });
  };

  setErrors = errors => {
    this.setState({ errors });
  };

  resetErrors = () => {
    this.setState({ errors: [] });
  };

  showErrors = () => {
    this.state.errors.forEach(e => {
      toastr.error(e);
    });
  };
}
export default SignIn;
