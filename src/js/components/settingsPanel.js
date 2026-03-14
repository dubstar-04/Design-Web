import "../../css/SettingsPanel.css";
import React, { Component } from "react";
import DialogRow from "./dialogRow";
import Switch from "./switch";
import { SideKickContent } from "./sideKick";

const SNAP_SETTINGS = [
  { key: 'endsnap',     label: 'End Snap' },
  { key: 'midsnap',     label: 'Mid Snap' },
  { key: 'centresnap',  label: 'Centre Snap' },
  { key: 'nearestsnap', label: 'Nearest Snap' },
  { key: 'polar',       label: 'Polar' },
  { key: 'ortho',       label: 'Ortho' },
];

const CANVAS_SETTINGS = [
  { key: 'drawgrid', label: 'Draw Grid' },
];

export default class SettingsPanel extends Component {
  getSetting(key) {
    try {
      return this.props.core.settings.getSetting(key);
    } catch {
      return false;
    }
  }

  onToggle(key, value) {
    try {
      this.props.core.settings.setSetting(key, value);
      this.forceUpdate();
    } catch {
      // setting update failed
    }
  }

  renderGroup(title, settings) {
    return (
      <>
        <div className="settings-group-header">{title}</div>
        {settings.map(({ key, label }) => (
          <DialogRow
            key={key}
            label={label}
            suffix={<Switch checked={!!this.getSetting(key)} onChange={(e) => this.onToggle(key, e.target.checked)} />}
            variant="form"
          />
        ))}
      </>
    );
  }

  render() {
    return (
      <SideKickContent>
        {this.renderGroup('Snaps', SNAP_SETTINGS)}
        {this.renderGroup('Canvas', CANVAS_SETTINGS)}
      </SideKickContent>
    );
  }
}
