import "../css/backend.css";
import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Link,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Sidebar from "./adminComponents/Sidebar";
import SidebarToggle from "./adminComponents/SidebarToggle";
import Dashboard from "./adminComponents/Dashboard";
import AttractionForm from "./adminComponents/AttractionForm";
import AttractionList from "./adminComponents/AttractionList";
import BreadcrumbArea from "./adminComponents/BreadcrumbArea";
import firebase from "firebase";

class Admin extends Component {
  constructor() {
    super();
    this.state = {
      shouldRedirect: false,
      redirectTo: "/"
    };
  }
  componentWillMount(){
    // Redirect if not me. I know...
    firebase.auth().onAuthStateChanged(user => {
      let shouldRedirect = true;
      if(user){
        if(user.uid === "ACm5e6uGbvSjHmxGam3Ic7f9IAj1"){
          shouldRedirect = false;
        }
      }
      this.setState({shouldRedirect: shouldRedirect});
    })
  }
  render() {
    return (
      <div>
        {this.state.shouldRedirect ? (
          <Redirect to={this.state.redirectTo} />
        ) : null}
        <div id="wrapper">
          <div className="row">
            <Route path="/admin" component={Sidebar} />
            <Route path="/admin" component={SidebarToggle} />
          </div>
        </div>
        <BreadcrumbArea />
        <Switch>
          <Route exact path="/admin/" component={Dashboard} />
          <Route exact path="/admin/attractions" component={AttractionList} />
          <Route path="/admin/attractions/:id" component={AttractionForm} />
        </Switch>
      </div>
    );
  }
}

export default Admin;
