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
    const { isModified } = this.props;
    return (
      <div className="headerbar">
        <div className="headerbar-title">
          {isModified && <span className="headerbar-modified-dot" title="Unsaved changes" />}
          <h3>Design</h3>
        </div>
        <div className="headerbar-menu">
          <ToolbarButton icon={`${process.env.PUBLIC_URL}/icons/platform/menu-symbolic.svg`} onClick={this.handleOnClick.bind(this)} />
        </div>
      </div>
    );
  }
}
