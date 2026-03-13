import React, { Component } from "react";

export default class DialogRowMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false, menuPos: null };
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick);
  }

  handleDocumentClick() {
    if (this.state.isOpen) {
      this.setState({ isOpen: false, menuPos: null });
    }
  }

  handleToggle(e) {
    e.stopPropagation();
    if (this.state.isOpen) {
      this.setState({ isOpen: false, menuPos: null });
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      this.setState({
        isOpen: true,
        menuPos: { top: rect.bottom + 4, right: window.innerWidth - rect.right },
      });
    }
  }

  close() {
    this.setState({ isOpen: false, menuPos: null });
  }

  render() {
    const { isCurrent, isIndelible, onSetCurrent, onEdit, onDelete } = this.props;
    const { isOpen, menuPos } = this.state;
    return (
      <div className="dialog-menu-wrapper">
        <button
          className="dialog-menu-btn"
          onClick={e => this.handleToggle(e)}
          title="Layer options"
        >⋮</button>
        {isOpen && menuPos && (
          <div
            className="dialog-row-menu"
            style={{ top: menuPos.top, right: menuPos.right }}
          >
            <button
              className={`dialog-menu-item${isCurrent ? ' dialog-menu-item-disabled' : ''}`}
              disabled={isCurrent}
              onClick={e => { e.stopPropagation(); this.close(); onSetCurrent(); }}
            >Set Current</button>
            <button
              className="dialog-menu-item"
              onClick={e => { e.stopPropagation(); this.close(); onEdit(); }}
            >Edit</button>
            <button
              className={`dialog-menu-item dialog-menu-item-destructive${isIndelible || isCurrent ? ' dialog-menu-item-disabled' : ''}`}
              disabled={isIndelible || isCurrent}
              onClick={e => { e.stopPropagation(); this.close(); onDelete(); }}
            >Delete</button>
          </div>
        )}
      </div>
    );
  }
}
