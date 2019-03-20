import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class BreadcrumbArea extends Component {
  constructor() {
    super();
  }

  /**
   * Parses a route into an array of model names. Used in breadcrumbs.
   */
  _parseRoute = route => {
    const routes = route.split("/");
    return routes.map((currentRoute, itemKey) => {
      if (currentRoute !== "") {
        return (
          <li
            className="breadcrumb-item active"
            aria-current="page"
            key={itemKey}
          >
            {currentRoute.charAt(0).toUpperCase() + currentRoute.substr(1)}
          </li>
        );
      }
    });
  };

  render() {
    return (
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          {this._parseRoute(this.props.location.pathname)}
        </ol>
      </nav>
    );
  }
}

export default withRouter(BreadcrumbArea);
