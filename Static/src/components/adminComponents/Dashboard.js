import React, { Component } from "react";
import BreadcrumbArea from "./BreadcrumbArea";

class PageContent extends Component {
  render() {
    return (
      <div className="col-md-11">
        <div>
          <BreadcrumbArea />
          <h1>Your next vacation Admin Area</h1>
          <p>Here entities can be created, edited, etc.</p>
        </div>
      </div>
    );
  }
}
export default PageContent;
