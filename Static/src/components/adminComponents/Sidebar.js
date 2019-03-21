import React, { Component } from "react";
import { Link } from "react-router-dom";

class Sidebar extends Component {
  render() {
    return (
      <div id="sidebar-wrapper">
        <ul className="sidebar-nav">
          <li className="sidebar-brand">
            <Link to="/admin/">Your next vacation</Link>
          </li>
          <li>
            <Link to="/admin/">Dashboard</Link>
          </li>
          <li>
            <Link to="/admin/attractions">Attractions</Link>
          </li>
          <li>
            <Link to="/">Back</Link>
          </li>
        </ul>
      </div>
    );
  }
}
export default Sidebar;
