import React, { Component } from "react";

export default class SideKickEdit extends Component {
  render() {
    const { title, toolbar, className, children } = this.props;
    const cls = `sidekick-content-detail${className ? ` ${className}` : ''}`;
    return (
      <div className={cls}>
        {(title || toolbar) && (
          <div className="sidekick-content-detail-header">
            {title && <div className="sidekick-content-detail-title">{title}</div>}
            {toolbar && <div className="sidekick-content-detail-toolbar">{toolbar}</div>}
          </div>
        )}
        <div className="sidekick-row-group">
          {children}
        </div>
      </div>
    );
  }
}
