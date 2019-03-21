import React, { Component } from "react";
import { Link } from "react-router-dom";

class FloatingActionButton extends Component {
  render() {
    return (
      <Link
        className={`btn btn-${this.props.type} rounded-circle btn-fab`}
        to={this.props.to}
      >
        <i className={`fa ${this.props.icon}`} aria-hidden="true" />
      </Link>
    );
  }
}

export default FloatingActionButton;
