import "../../css/Headerbar.css";
import "../../css/ToolbarButton.css";
import React, { Component } from "react";
import ToolbarButton from "./toolbarButton";

export default class Headerbar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * onClick handler for menu button
   */
  handleOnClick(){
    this.props.popover.current.toggleVisibility()
  }

  render() {
    return (
      <div className="headerbar">
        <div className="headerbar-title">
          <h3>Design</h3>
        </div>
        <div className="headerbar-menu">
          <ToolbarButton icon="/icons/platform/menu-symbolic.svg" onClick={this.handleOnClick.bind(this)} />
        </div>
      </div> 
    );
  }
}
