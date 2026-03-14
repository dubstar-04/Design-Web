import "../../css/AboutWindow.css";
import React, { Component } from "react";

export default class AboutWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {visible: false};
  }

  toggleVisibility() {
    this.setState({visible: !this.state.visible});
  }

  close() {
    this.setState({visible: false});
  }

  render() {
    if (!this.state.visible) {
      return <></>;
    }

    return (
      <div className="dialogbackground" onClick={this.close.bind(this)}>
        <div className="about-window" onClick={(e) => e.stopPropagation()}>
          <img
            alt="Design"
            className="about-window-icon"
            src={`${process.env.PUBLIC_URL}/icons/design.svg`}
          />
          <h2 className="about-window-title">Design</h2>
          <p className="about-window-description">2D CAD for the web</p>
          {process.env.REACT_APP_GIT_COMMIT && (
            <p className="about-window-version">Version: {process.env.REACT_APP_GIT_COMMIT}</p>
          )}
          <p className="about-window-author">By <strong>Daniel Wood</strong></p>
          <div className="about-window-links">
            <a
              className="about-window-link"
              href="https://github.com/dubstar-04/Design-Web/issues"
              rel="noopener noreferrer"
              target="_blank"
            >
              Report an Issue
            </a>
          </div>
          <button className="about-window-close" onClick={this.close.bind(this)}>Close</button>
        </div>
      </div>
    );
  }
}
