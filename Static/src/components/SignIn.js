import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { request, methods } from "../helpers/HttpHelper";

class SignIn extends Component {
  AUTH_URL = "/api/authenticate/";
  ERROR_TIMEOUT = 5000;
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
    return (
      <div>
        {this.state.shouldRedirect ? (
          <Redirect to={this.state.redirectTo} />
        ) : null}
        <div className="container-fluid">
          <div className="col-md-8 offset-md-2">
            {this.showErrors()}
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
    //deleteCookie("api_token");
    this.setState({ currentUser: null });
  };

  componentWillMount = async () => {
    const apiToken = null;
    //const apiToken = getCookie("api_token");
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
    if (this.validateUser()) {
      const { userName, pass } = this.state.userData;
      const res = await request(this.AUTH_URL, methods.POST, {
        user_name: userName,
        password: pass
      });
      const json = await res.json();
      if (json.success) {
        this.setState({ shouldRedirect: true });
      } else if (res.status === 401 || res.status === 404) {
        this.setErrors(["Unauthorized: wrong username or password"]);
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
    setTimeout(() => this.resetErrors(), this.ERROR_TIMEOUT);
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
    return this.state.errors.map((error, itemKey) => {
      return (
        <div className="alert alert-danger" role="alert" key={itemKey}>
          {error}
        </div>
      );
    });
  };
}
export default SignIn;
