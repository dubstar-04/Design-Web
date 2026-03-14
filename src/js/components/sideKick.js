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
    if (this.state.visible) {
      this.close();
    } else {
      if (this.props.onOpenChange) this.props.onOpenChange(true);
      this.setState({ visible: true }, () => {
        // Trigger the open transition on the next frame
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

  setActiveTab(id) {
    this.setState({ activeTab: id });
  }

  render() {
    if (!this.state.visible) {
      return <></>;
    }

    const tabs = this.props.tabs || DEFAULT_TABS;
    const activeTab = tabs.find(t => t.id === this.state.activeTab) || tabs[0];

    return (
      <div
        className={`sidekick ${this.state.open ? "sidekick--open" : ""}`}
        onTransitionEnd={this.handleTransitionEnd}
      >
        <DialogHeader
          onBack={this.props.onBack}
          onClose={this.close.bind(this)}
          title={activeTab.label}
        />
        <div className="sidekick-layout">
          <div className="sidekick-content">
            {activeTab.content}
          </div>
          <div className="sidekick-tabs">
            {tabs.map(tab => (
              <button
                className={`sidekick-tab${tab.id === this.state.activeTab ? " sidekick-tab--active" : ""}`}
                key={tab.id}
                onClick={() => this.setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export { default as SideKickContent } from "./sideKickContent";
export { default as SideKickEdit } from "./sideKickEdit";
