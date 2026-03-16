import React, { Component } from "react";

const sessionHeights = {};

export default class SideKickEdit extends Component {
  constructor(props) {
    super(props);
    this.state = { height: sessionHeights[props.title] ?? null };
    this.detailRef = React.createRef();
    this.startY = 0;
    this.startHeight = 0;
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  removeListeners() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  onResizeStart(clientY) {
    this.startY = clientY;
    this.startHeight = this.detailRef.current.offsetHeight;
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'ns-resize';
  }

  onMouseMove(e) {
    this.applyResize(e.clientY);
  }

  applyResize(clientY) {
    const el = this.detailRef.current;
    if (!el) return;
    const parentHeight = el.parentElement.offsetHeight;
    const MIN_HEIGHT = 72;
    const MAX_HEIGHT = Math.floor(parentHeight * 0.75);
    const delta = this.startY - clientY;
    const newHeight = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, this.startHeight + delta));
    this.setState({ height: newHeight });
  }

  onMouseUp() {
    this.removeListeners();
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    if (this.state.height !== null) {
      sessionHeights[this.props.title] = this.state.height;
    }
  }

  render() {
    const { title, toolbar, className, children } = this.props;
    const { height } = this.state;
    const cls = `sidekick-content-detail${className ? ` ${className}` : ''}`;
    const style = height !== null ? { height: `${height}px`, maxHeight: 'none' } : undefined;
    return (
      <div className={cls} ref={this.detailRef} style={style}>
        <div
          className="sidekick-content-detail-handle"
          onMouseDown={e => { e.preventDefault(); this.onResizeStart(e.clientY); }}
        />
        {(title || toolbar) && (
          <div className="sidekick-content-detail-header">
            {title && <div className="sidekick-content-detail-title">{title}</div>}
            {toolbar && <div className="sidekick-content-detail-toolbar">{toolbar}</div>}
          </div>
        )}
        <div className="sidekick-content-detail-body">
          <div className="sidekick-row-group">
            {children}
          </div>
        </div>
      </div>
    );
  }
}
