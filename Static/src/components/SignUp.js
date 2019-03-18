import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { request, methods } from "../helpers/HttpHelper";

class SignUp extends Component {
  AUTH_URL = "/api/authenticate/";
  BASE_URL = "/api/users/";
  ERROR_TIMEOUT = 5000;
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
    return (
      <div>
        {this.state.shouldRedirect ? (
          <Redirect to={this.state.redirectTo} />
        ) : null}
        <div className="container-fluid">
          <div className="col-md-8 offset-md-2">
            {this.showErrors()}
            {this.showMessages()}
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
                  Password:{" "}
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
                  Confirm password:{" "}
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
                  First Name:{" "}
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
                  Last Name:{" "}
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

  handleLogout = () => {
    // deleteCookie("api_token");
    this.setState({ currentUser: null });
  };

  componentWillMount = async () => {
    //const apiToken = getCookie("api_token");
    const apiToken = null;
    if (apiToken && apiToken !== "") {
      const res = await fetch(this.AUTH_URL + encodeURIComponent(apiToken));
      const json = await res.json();
      if (json.success) {
        this.setState({
          ...this.state,
          currentUser: json.data,
          shouldRedirect: true
        });
      }
    }
  };

  handleSubmit = async e => {
    e.preventDefault();
    if (this.state.submitted) return;
    if (this.validateUser()) {
      const { userName, pass, firstName, lastName } = this.state.userData;
      const res = await request(this.BASE_URL, methods.POST, {
        user_name: userName,
        password: pass,
        first_name: firstName,
        last_name: lastName,
        role_id: 1
      });
      const json = await res.json();
      if (json.success) {
        this.setMessages(["User successfully added!"]);
        this.setState({ submitted: true });
        setTimeout(
          () =>
            this.setState({
              ...this.state,
              shouldRedirect: true,
              redirectTo: "/login"
            }),
          1000
        );
      } else {
        this.setErrors(json.err.errors.map(o => o.message));
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
    setTimeout(() => this.resetErrors(), this.ERROR_TIMEOUT);
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
      return (
        <div className="alert alert-success" role="alert" key={itemKey}>
          {message}
        </div>
      );
    });
  };

  setErrors = errors => {
    this.setState({ errors });
  };

  resetErrors = () => {
    this.setState({ errors: [] });
  };

  showErrors = () => {
    return this.state.errors.map((error, itemKey) => {
      return (
        <div className="alert alert-danger" role="alert" key={itemKey}>
          {error}
        </div>
      );
    });
  };
}
export default SignUp;
