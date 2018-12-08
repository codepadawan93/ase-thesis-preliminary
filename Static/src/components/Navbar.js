import React from "react";
import logo from "../theme/img/your_next_vacation.png";

const Navbar = props => {
  return (
    <nav className="navbar navbar-light bg-light static-top">
      <div className="container">
        <a className="navbar-brand" href="#">
          <img src={logo} width="35" height="35" alt="" className="mr-3" />
          Your next vacation
        </a>
        <a
          className="btn btn-primary"
          href="#"
          onClick={e => props.handleNavigate(e)}
        >
          Sign in
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
