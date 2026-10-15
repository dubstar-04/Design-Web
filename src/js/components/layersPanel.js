import React, { Component } from "react";
import ConfirmationDialog from "./confirmationDialog";
import DialogRow from "./dialogRow";
import Switch from "./switch";
import { SideKickContent, SideKickEdit } from "./sideKick";

export default class LayersPanel extends Component {
  constructor(props) {
    super(props);
    this.confirmDialogRef = React.createRef();
    this.state = this.getInitialState();
  }

  // Only in-progress edits are buffered; the selected layer is resolved from the active manager on render.
  getInitialState() {
    return {
      selectedName: null,
      confirmDeleteName: null,
      editName: null,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.core !== this.props.core || prevProps.revision !== this.props.revision) {
      this.setState(this.getInitialState());
    }
  }

  getSelectedLayer() {
    const layers = this.getLayers();
    const current = this.getCurrentLayer();
    return layers.find(l => l.name === this.state.selectedName) ||
      layers.find(l => l.name === current) ||
      layers[0];
  }

  getLayers() {
    return this.props.core.layerManager.getItems();
  }

  getLineTypes() {
    const lineStyles = this.props.core.ltypeManager.getItems();
    return lineStyles
      .filter(s => !['BYLAYER', 'BYBLOCK'].includes(s.name.toUpperCase()))
      .map(s => s.name);
  }

  getCurrentLayer() {
    return this.props.core.layerManager.getCstyle();
  }

  onNewLayer() {
    this.props.core.layerManager.newItem();
    const layers = this.getLayers();
    const newLayer = layers[layers.length - 1];
    this.setState({ selectedName: newLayer?.name ?? null, editName: null });
  }

  onSelectLayer(layer) {
    this.setState({ selectedName: layer.name, editName: null });
  }

  onSetCurrentLayer(layer) {
    this.props.core.layerManager.setCstyle(layer.name);
    this.forceUpdate();
  }

  onConfirmDelete(layer) {
    this.setState({ confirmDeleteName: layer.name }, () => {
      this.confirmDialogRef.current.show();
    });
  }

  onCancelDelete() {
    this.setState({ confirmDeleteName: null });
  }

  onDeleteLayer() {
    const { confirmDeleteName } = this.state;
    if (confirmDeleteName) {
      const index = this.props.core.layerManager.getItemIndex(confirmDeleteName);
      if (index >= 0) this.props.core.layerManager.deleteStyle(index);
      this.setState({ confirmDeleteName: null, selectedName: null, editName: null });
    }
  }

  onColourChange(layer, e) {
    const hex = e.target.value;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    layer.colour = { r, g, b };
    this.forceUpdate();
  }

  onNameBlur() {
    const { editName } = this.state;
    const layer = this.getSelectedLayer();
    if (!layer || editName === null) return;
    const index = this.props.core.layerManager.getItemIndex(layer.name);
    if (index >= 0) {
      this.props.core.layerManager.renameStyle(index, editName);
      this.setState({ selectedName: this.props.core.layerManager.getItemByIndex(index).name, editName: null });
    }
  }

  onNameKeyDown(e) {
    if (e.key === 'Enter') e.target.blur();
  }

  setLayerValue(prop, value) {
    const layer = this.getSelectedLayer();
    if (!layer) return;
    layer[prop] = value;
    this.forceUpdate();
  }

  colourToHex(colour) {
    if (!colour || typeof colour !== 'object') return '#ffffff';
    const toHex = v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
    return `#${toHex(colour.r)}${toHex(colour.g)}${toHex(colour.b)}`;
  }

  renderEditPanel() {
    const { editName } = this.state;
    const selectedLayer = this.getSelectedLayer();
    const currentLayer = this.getCurrentLayer();
    const indelibleLayers = this.props.core.layerManager.indelibleItems;
    const isIndelible = !selectedLayer || indelibleLayers.some(i => i.toUpperCase() === selectedLayer.name.toUpperCase());
    const lineTypes = this.getLineTypes();
    return (
      <SideKickEdit
        title="Layer Properties"
        toolbar={
          <>
            <button className="panel-add-btn" onClick={this.onNewLayer.bind(this)} title="New Layer">+</button>
            <button
              className="panel-delete-btn"
              disabled={!selectedLayer || isIndelible}
              onClick={() => this.onConfirmDelete(selectedLayer)}
              title="Delete Selected Layer"
            >−</button>
            <button
              className="panel-setcurrent-btn"
              disabled={!selectedLayer || selectedLayer.name === currentLayer}
              onClick={() => this.onSetCurrentLayer(selectedLayer)}
              title="Set as Current Layer"
            >✓</button>
          </>
        }
      >
        <DialogRow
          label="Name"
          suffix={
            <input
              className="dialogrow-input dialogrow-input--text"
              onBlur={this.onNameBlur.bind(this)}
              onChange={e => this.setState({ editName: e.target.value })}
              onKeyDown={this.onNameKeyDown.bind(this)}
              type="text"
              value={editName ?? selectedLayer?.name ?? ''}
            />
          }
          variant="form"
        />
        <DialogRow
          label="Visible"
          suffix={<Switch checked={!!selectedLayer?.on} onChange={e => this.setLayerValue('on', e.target.checked)} />}
          variant="form"
        />
        <DialogRow
          label="Frozen"
          suffix={<Switch checked={!!selectedLayer?.frozen} onChange={e => this.setLayerValue('frozen', e.target.checked)} />}
          variant="form"
        />
        <DialogRow
          label="Locked"
          suffix={<Switch checked={!!selectedLayer?.locked} onChange={e => this.setLayerValue('locked', e.target.checked)} />}
          variant="form"
        />
        <DialogRow
          label="Line Type"
          suffix={
            <select
              className="dialogrow-input dialogrow-input--select"
              onChange={e => { this.setLayerValue('lineType', e.target.value); e.target.blur(); }}
              value={selectedLayer?.lineType}
            >
              {lineTypes.map(lt => <option key={lt} value={lt}>{lt}</option>)}
            </select>
          }
          variant="form"
        />
        <DialogRow
          label="Line Weight"
          suffix={<span className="dialogrow-value-readonly">{String(selectedLayer?.lineWeight)}</span>}
          variant="form"
        />
        <DialogRow
          label="Plotting"
          suffix={<Switch checked={!!selectedLayer?.plotting} onChange={e => this.setLayerValue('plotting', e.target.checked)} />}
          variant="form"
        />
      </SideKickEdit>
    );
  }

  render() {
    const layers = this.getLayers();
    const currentLayer = this.getCurrentLayer();
    const { confirmDeleteName } = this.state;
    const selectedLayer = this.getSelectedLayer();

    return (
      <div className="sidekick-content-panel">
        <SideKickContent>
          <div className="sidekick-content-list">
            {layers.map((layer, index) => (
              <DialogRow
                isCurrent={layer.name === selectedLayer?.name}
                key={index}
                label={layer.name}
                onClick={() => this.onSelectLayer(layer)}
                prefix={
                  <input
                    className="dialogrow-colour-input"
                    onChange={e => this.onColourChange(layer, e)}
                    onClick={e => e.stopPropagation()}
                    title="Change colour"
                    type="color"
                    value={this.colourToHex(layer.colour)}
                  />
                }
                suffix={layer.name === currentLayer ? <span className="dialogrow-badge">current</span> : undefined}
              />
            ))}
          </div>
        </SideKickContent>
        {this.renderEditPanel()}
        <ConfirmationDialog
          cancelLabel="Cancel"
          confirmLabel="Delete"
          message={confirmDeleteName ? `Delete layer "${confirmDeleteName}"?` : ''}
          onCancel={this.onCancelDelete.bind(this)}
          onConfirm={this.onDeleteLayer.bind(this)}
          ref={this.confirmDialogRef}
          title="Delete Layer"
        />
      </div>
    );
  }
}
