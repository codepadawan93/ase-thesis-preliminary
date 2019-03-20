import React, { Component } from "react";

class SidebarToggle extends Component {
  constructor() {
    super();
    this.state = {
      icon: "fa fa-angle-right"
    };
  }
  render() {
    return (
      <div>
        <button
          className="btn btn-primary sidebar-toggle"
          id="menu-toggle"
          onClick={() => {
            this.setState({
              icon:
                this.state.icon === "fa fa-angle-right"
                  ? "fa fa-angle-left"
                  : "fa fa-angle-right"
            });
            document.querySelector("#wrapper").classList.toggle("toggled");
          }}
        >
          <i className={this.state.icon} aria-hidden="true" />
        </button>
      </div>
    );
  }
}

export default SidebarToggle;
