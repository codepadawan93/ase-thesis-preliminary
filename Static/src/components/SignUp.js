import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import toastr from "toastr";
import firebase from "firebase";

class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      currentUser: null,
      userData: {
        userName: "",
        pass: "",
        pass2: "",
        firstName: "",
        lastName: ""
      },
      errors: [],
      messages: [],
      submitted: false,
      shouldRedirect: false,
      redirectTo: "/"
    };
  }
  render() {
    this.showErrors();
    this.showMessages();
    return (
      <div>
        {this.state.shouldRedirect ? (
          <Redirect to={this.state.redirectTo} />
        ) : null}
        <div className="container-fluid">
          <div className="col-md-8 offset-md-2">
            <h2>Sign up</h2>
            <form>
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
                    onChange={e => {
                      this.updateUserData(e);
                    }}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="pass" className="col-md-2 col-form-label">
                  Password:
                </label>
                <div className="col-md-10">
                  <input
                    type="password"
                    name="pass"
                    className="form-control"
                    value={this.state.userData.pass}
                    onChange={e => {
                      this.updateUserData(e);
                    }}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="pass2" className="col-md-2 col-form-label">
                  Confirm password:
                </label>
                <div className="col-md-10">
                  <input
                    type="password"
                    name="pass2"
                    className="form-control"
                    value={this.state.userData.pass2}
                    onChange={e => {
                      this.updateUserData(e);
                    }}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="firstName" className="col-md-2 col-form-label">
                  First Name:
                </label>
                <div className="col-md-10">
                  <input
                    type="text"
                    name="firstName"
                    className="form-control"
                    value={this.state.userData.firstName}
                    onChange={e => {
                      this.updateUserData(e);
                    }}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="lastName" className="col-md-2 col-form-label">
                  Last Name:
                </label>
                <div className="col-md-10">
                  <input
                    type="text"
                    name="lastName"
                    className="form-control"
                    value={this.state.userData.lastName}
                    onChange={e => {
                      this.updateUserData(e);
                    }}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-2">
                  <Link className="btn btn-secondary" to="/sign-in">
                    Sign in
                  </Link>
                </div>
                <div className="col-md-2">
                  <button
                    className="btn btn-primary"
                    onClick={e => this.handleSubmit(e)}
                  >
                    Submit
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

  componentWillMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          ...this.state,
          currentUser: user,
          shouldRedirect: true
        });
      }
    });
  };

  handleSubmit = async e => {
    e.preventDefault();
    if (this.state.submitted) return;
    if (this.validateUser()) {
      try {
        const { userName, pass, firstName, lastName } = this.state.userData;
        const res = await firebase
          .auth()
          .createUserWithEmailAndPassword(userName, pass);

        if (res.user.uid) {
          await firebase
            .database()
            .ref(`users/${res.user.uid}`)
            .set({
              firstName,
              lastName,
              createdAt: Date()
            });
          this.setMessages(["User successfully added!"]);
          this.setState({
            ...this.state,
            submitted: true,
            shouldRedirect: true,
            redirectTo: "/"
          });
        } else {
          this.setErrors(["User was not created."]);
        }
      } catch (err) {
        this.setErrors([`${err.code}: ${err.message}`]);
      }
    }
  };

  validateUser() {
    const { userName, pass, pass2, firstName, lastName } = this.state.userData;
    let errors = [];
    let valid = true;
    if (userName === "") {
      errors.push("Username must be filled out");
      valid = false;
    }
    if (pass === "" || pass.length < 6) {
      errors.push(
        "The password should be filled in and be at least 6 characters long"
      );
      valid = false;
    }
    if (pass2 !== pass) {
      errors.push("The passwords should match");
      valid = false;
    }
    if (firstName === "") {
      errors.push("You must fill out your name");
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

  setMessages = messages => {
    this.setState({ messages });
    setTimeout(() => this.resetMessages(), this.ERROR_TIMEOUT);
  };

  resetMessages = () => {
    this.setState({ messages: [] });
  };

  showMessages = () => {
    return this.state.messages.map((message, itemKey) => {
      toastr.success(message);
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
export default SignUp;
