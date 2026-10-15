import React, { Component } from "react";
import DialogRow from "./dialogRow";
import Switch from "./switch";
import { SideKickContent } from "./sideKick";

export default class LineStylePanel extends Component {
  getManager() {
    return this.props.core.ltypeManager;
  }

  // Loaded line types cannot be unloaded, matching the desktop preferences page
  onLoad(style) {
    this.getManager().addItem(style);
    this.props.core.scene.stateManager.stateChanged(true);
    this.forceUpdate();
  }

  render() {
    const manager = this.getManager();

    return (
      <SideKickContent>
        <div className="sidekick-content-list">
          <div className="settings-group-header">Select line styles</div>
          <div className="sidekick-row-group">
            {manager.getOptionalStyles().map(style => {
              const loaded = manager.itemExists(style.name);
              return (
                <DialogRow
                  key={style.name}
                  label={style.name}
                  subtitle={style.description}
                  suffix={<Switch checked={loaded} disabled={loaded} onChange={() => this.onLoad(style)} />}
                  variant="form"
                />
              );
            })}
          </div>
        </div>
      </SideKickContent>
    );
  }
}
