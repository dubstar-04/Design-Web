import React, { Component } from "react";

export default class SideKickContent extends Component {
  render() {
    const { className, children } = this.props;
    const cls = `sidekick-content-scroll${className ? ` ${className}` : ''}`;
    return <div className={cls}>{children}</div>;
  }
}
