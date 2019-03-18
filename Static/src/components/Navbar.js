import React from "react";
import { Link } from "react-router-dom";
import logo from "../theme/img/your_next_vacation.png";

const Navbar = props => {
  return (
    <nav className="navbar navbar-light bg-light static-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src={logo} width="35" height="35" alt="" className="mr-3" />
          Your next vacation
        </Link>
        <Link className="btn btn-primary" to="/sign-in">
          Sign in
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
