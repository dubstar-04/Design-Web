import React, { Component } from "react";
import DialogRow from "./dialogRow";
import Switch from "./switch";
import { SideKickContent } from "./sideKick";

const SNAP_SETTINGS = [
  { key: 'endsnap',           label: 'End Snap' },
  { key: 'midsnap',           label: 'Mid Snap' },
  { key: 'centresnap',        label: 'Centre Snap' },
  { key: 'quadrantsnap',      label: 'Quadrant Snap' },
  { key: 'nearestsnap',       label: 'Nearest Snap' },
  { key: 'tangentsnap',       label: 'Tangent Snap' },
  { key: 'nodesnap',          label: 'Node Snap' },
  { key: 'perpendicularsnap', label: 'Perpendicular Snap' },
];

const POLAR_ANGLE_OPTIONS = [5, 10, 15, 22.5, 30, 45, 90];

const TRACKING_SETTINGS = [
  { key: 'polar',      label: 'Polar' },
  { key: 'ortho',      label: 'Ortho' },
  { key: 'polarangle', label: 'Polar Angle', type: 'select', options: POLAR_ANGLE_OPTIONS.map((a) => ({ value: a, label: `${a}°` })) },
];

const CANVAS_SETTINGS = [
  { key: 'drawgrid', label: 'Draw Grid' },
];

export default class SettingsPanel extends Component {
  getSetting(key) {
    try {
      return this.props.core.settings.getSetting(key);
    } catch {
      return undefined;
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

  onSelectChange(key, value) {
    try {
      this.props.core.settings.setSetting(key, Number(value));
      this.forceUpdate();
    } catch {
      // setting update failed
    }
  }

  renderGroup(title, settings) {
    return (
      <React.Fragment key={title}>
        <div className="settings-group-header">{title}</div>
        <div className="sidekick-row-group">
          {settings.map(({ key, label, type, options }) => (
            <DialogRow
              key={key}
              label={label}
              suffix={
                type === 'select' ? (
                  <select
                    className="dialogrow-input dialogrow-input--select"
                    onChange={(e) => this.onSelectChange(key, e.target.value)}
                    value={(() => { const v = this.getSetting(key); return options.some((o) => o.value === v) ? v : options[0]?.value; })()}
                  >
                    {options.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : (
                  <Switch checked={!!this.getSetting(key)} onChange={(e) => this.onToggle(key, e.target.checked)} />
                )
              }
              variant="form"
            />
          ))}
        </div>
      </React.Fragment>
    );
  }

  render() {
    return (
      <SideKickContent>
        <div className="sidekick-content-list">
          {this.renderGroup('Snaps', SNAP_SETTINGS)}
          {this.renderGroup('Tracking', TRACKING_SETTINGS)}
          {this.renderGroup('Canvas', CANVAS_SETTINGS)}
        </div>
      </SideKickContent>
    );
  }
}
