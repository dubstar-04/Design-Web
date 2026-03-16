import React, { Component } from "react";
import ConfirmationDialog from "./confirmationDialog";
import DialogRow from "./dialogRow";
import Switch from "./switch";
import { SideKickContent, SideKickEdit } from "./sideKick";

export default class LayersPanel extends Component {
  constructor(props) {
    super(props);
    this.confirmDialogRef = React.createRef();
    this.state = {
      selectedLayer: null,
      selectedLayerName: '',
      confirmDeleteLayer: null,
      editName: '',
      editOn: true,
      editFrozen: false,
      editLocked: false,
      editLineType: 'CONTINUOUS',
      editLineWeight: 'DEFAULT',
      editPlotting: true,
    };
  }

  componentDidMount() {
    // Pre-select the current layer so the edit panel is always populated
    const currentName = this.getCurrentLayer();
    const layers = this.getLayers();
    const current = layers.find(l => l.name === currentName) || layers[0];
    if (current) this.onSelectLayer(current);
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
    if (newLayer) this.onSelectLayer(newLayer);
    else this.forceUpdate();
  }

  onSelectLayer(layer) {
    this.setState({
      selectedLayer: layer,
      selectedLayerName: layer.name,
      editName: layer.name,
      editOn: layer.on,
      editFrozen: layer.frozen,
      editLocked: layer.locked,
      editLineType: layer.lineType,
      editLineWeight: layer.lineWeight,
      editPlotting: layer.plotting,
    });
  }

  onSetCurrentLayer(layer) {
    this.props.core.layerManager.setCstyle(layer.name);
    this.forceUpdate();
  }

  onConfirmDelete(layer) {
    this.setState({ confirmDeleteLayer: layer }, () => {
      this.confirmDialogRef.current.show();
    });
  }

  onCancelDelete() {
    this.setState({ confirmDeleteLayer: null });
  }

  onDeleteLayer() {
    const { confirmDeleteLayer, selectedLayer } = this.state;
    if (confirmDeleteLayer) {
      const index = this.props.core.layerManager.getItemIndex(confirmDeleteLayer.name);
      this.props.core.layerManager.deleteStyle(index);
      const nextSelected = selectedLayer && selectedLayer.name === confirmDeleteLayer.name ? null : selectedLayer;
      this.setState({ confirmDeleteLayer: null, selectedLayer: nextSelected });
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
    const { selectedLayerName, editName } = this.state;
    if (!selectedLayerName) return;
    const index = this.props.core.layerManager.getItemIndex(selectedLayerName);
    if (index >= 0) {
      this.props.core.layerManager.renameStyle(index, editName);
      const actualName = this.props.core.layerManager.getItemByIndex(index).name;
      this.setState({ selectedLayerName: actualName, editName: actualName });
    }
  }

  onNameKeyDown(e) {
    if (e.key === 'Enter') e.target.blur();
  }

  onToggleChange(field, value) {
    const { selectedLayer } = this.state;
    if (!selectedLayer) return;
    this.setState({ [field]: value }, () => {
      if (field === 'editOn') selectedLayer.on = value;
      if (field === 'editFrozen') selectedLayer.frozen = value;
      if (field === 'editLocked') selectedLayer.locked = value;
      if (field === 'editPlotting') selectedLayer.plotting = value;
      if (field === 'editLineType') selectedLayer.lineType = value;
    });
  }

  colourToHex(colour) {
    if (!colour || typeof colour !== 'object') return '#ffffff';
    const toHex = v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
    return `#${toHex(colour.r)}${toHex(colour.g)}${toHex(colour.b)}`;
  }

  renderEditPanel() {
    const { editName, editOn, editFrozen, editLocked, editLineType, editLineWeight, editPlotting, selectedLayer } = this.state;
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
              value={editName}
            />
          }
          variant="form"
        />
        <DialogRow
          label="Visible"
          suffix={<Switch checked={editOn} onChange={e => this.onToggleChange('editOn', e.target.checked)} />}
          variant="form"
        />
        <DialogRow
          label="Frozen"
          suffix={<Switch checked={editFrozen} onChange={e => this.onToggleChange('editFrozen', e.target.checked)} />}
          variant="form"
        />
        <DialogRow
          label="Locked"
          suffix={<Switch checked={editLocked} onChange={e => this.onToggleChange('editLocked', e.target.checked)} />}
          variant="form"
        />
        <DialogRow
          label="Line Type"
          suffix={
            <select
              className="dialogrow-input dialogrow-input--select"
              onChange={e => { this.onToggleChange('editLineType', e.target.value); e.target.blur(); }}
              value={editLineType}
            >
              {lineTypes.map(lt => <option key={lt} value={lt}>{lt}</option>)}
            </select>
          }
          variant="form"
        />
        <DialogRow
          label="Line Weight"
          suffix={<span className="dialogrow-value-readonly">{String(editLineWeight)}</span>}
          variant="form"
        />
        <DialogRow
          label="Plotting"
          suffix={<Switch checked={editPlotting} onChange={e => this.onToggleChange('editPlotting', e.target.checked)} />}
          variant="form"
        />
      </SideKickEdit>
    );
  }

  render() {
    const layers = this.getLayers();
    const currentLayer = this.getCurrentLayer();
    const indelibleLayers = this.props.core.layerManager.indelibleItems;
    const { selectedLayer, confirmDeleteLayer } = this.state;
    const isIndelible = !selectedLayer || indelibleLayers.some(i => i.toUpperCase() === selectedLayer.name.toUpperCase());

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
          message={confirmDeleteLayer ? `Delete layer "${confirmDeleteLayer.name}"?` : ''}
          onCancel={this.onCancelDelete.bind(this)}
          onConfirm={this.onDeleteLayer.bind(this)}
          ref={this.confirmDialogRef}
          title="Delete Layer"
        />
      </div>
    );
  }
}
