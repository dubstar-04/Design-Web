import "../../css/SideKick.css";
import React, { Component } from "react";
import DialogHeader from "./dialogHeader";

const DEFAULT_TABS = [
  { id: 'properties', label: 'Properties' },
  { id: 'layers', label: 'Layers' },
  { id: 'settings', label: 'Settings' },
];

export default class SideKick extends Component {
  constructor(props) {
    super(props);
    const tabs = props.tabs || DEFAULT_TABS;
    this.state = { visible: false, open: false, activeTab: tabs[0].id };
    this.handleTransitionEnd = this.handleTransitionEnd.bind(this);
  }

  toggleVisibility() {
    if (this.state.open) {
      this.close();
    } else {
      if (this.props.onOpenChange) this.props.onOpenChange(true);
      this.setState({ visible: true }, () => {
        requestAnimationFrame(() => this.setState({ open: true }));
      });
    }
  }

  close() {
    if (this.props.onOpenChange) this.props.onOpenChange(false);
    this.setState({ open: false });
  }

  handleTransitionEnd() {
    if (!this.state.open) {
      this.setState({ visible: false });
    }
  }

  onTabClick(id) {
    if (this.state.open && this.state.activeTab === id) {
      // Same tab clicked while open — close the panel
      this.close();
    } else if (this.state.open) {
      // Different tab — just switch
      this.setState({ activeTab: id });
    } else {
      // Panel closed — open it with the selected tab
      if (this.props.onOpenChange) this.props.onOpenChange(true);
      this.setState({ visible: true, activeTab: id }, () => {
        requestAnimationFrame(() => this.setState({ open: true }));
      });
    }
  }

  openTab(id) {
    if (!this.state.open) {
      if (this.props.onOpenChange) this.props.onOpenChange(true);
      this.setState({ visible: true, activeTab: id }, () => {
        requestAnimationFrame(() => this.setState({ open: true }));
      });
    } else {
      this.setState({ activeTab: id });
    }
  }

  render() {
    const tabs = this.props.tabs || DEFAULT_TABS;
    const activeTab = tabs.find(t => t.id === this.state.activeTab) || tabs[0];
    const { open, visible } = this.state;

    return (
      <>
        {visible && (
          <div
            className={`sidekick${open ? ' sidekick--open' : ''}`}
            onTransitionEnd={this.handleTransitionEnd}
          >
            <DialogHeader
              onBack={this.props.onBack}
              onClose={this.close.bind(this)}
              title={activeTab.label}
            />
            <div className="sidekick-content">
              {activeTab.content}
            </div>
          </div>
        )}
        <div className="sidekick-tabs">
          {tabs.map(tab => (
            <button
              className={`sidekick-tab${tab.id === this.state.activeTab && open ? ' sidekick-tab--active' : ''}`}
              key={tab.id}
              onClick={() => this.onTabClick(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </>
    );
  }
}

export { default as SideKickContent } from "./sideKickContent";
export { default as SideKickEdit } from "./sideKickEdit";
