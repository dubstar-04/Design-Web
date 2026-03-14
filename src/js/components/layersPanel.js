import "../../css/LayersPanel.css";
import React, { Component } from "react";
import ConfirmationDialog from "./confirmationDialog";
import Row from "./dialogRow";

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
    this.forceUpdate();
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
    const { editName, editOn, editFrozen, editLocked, editLineType, editLineWeight, editPlotting } = this.state;
    const lineTypes = this.getLineTypes();
    return (
      <div className="layers-panel-edit">
        <div className="layers-panel-edit-title">Layer Properties</div>
        <Row label="Name" variant="form">
          <input
            className="layers-edit-input"
            onBlur={this.onNameBlur.bind(this)}
            onChange={e => this.setState({ editName: e.target.value })}
            onKeyDown={this.onNameKeyDown.bind(this)}
            type="text"
            value={editName}
          />
        </Row>
        <Row
          checked={editOn}
          label="Visible"
          onChange={e => this.onToggleChange('editOn', e.target.checked)}
          variant="form"
        />
        <Row
          checked={editFrozen}
          label="Frozen"
          onChange={e => this.onToggleChange('editFrozen', e.target.checked)}
          variant="form"
        />
        <Row
          checked={editLocked}
          label="Locked"
          onChange={e => this.onToggleChange('editLocked', e.target.checked)}
          variant="form"
        />
        <Row label="Line Type" variant="form">
          <select
            className="layers-edit-select"
            onChange={e => this.onToggleChange('editLineType', e.target.value)}
            value={editLineType}
          >
            {lineTypes.map(lt => <option key={lt} value={lt}>{lt}</option>)}
          </select>
        </Row>
        <Row label="Line Weight" variant="form">
          <span className="layers-edit-value">{String(editLineWeight)}</span>
        </Row>
        <Row
          checked={editPlotting}
          label="Plotting"
          onChange={e => this.onToggleChange('editPlotting', e.target.checked)}
          variant="form"
        />
      </div>
    );
  }

  render() {
    const layers = this.getLayers();
    const currentLayer = this.getCurrentLayer();
    const indelibleLayers = this.props.core.layerManager.indelibleItems;
    const { selectedLayer, confirmDeleteLayer } = this.state;
    const isIndelible = selectedLayer && indelibleLayers.some(i => i.toUpperCase() === selectedLayer.name.toUpperCase());

    return (
      <div className="layers-panel">
        <div className="layers-panel-toolbar">
          <button className="layers-panel-add-btn" onClick={this.onNewLayer.bind(this)} title="New Layer">+</button>
          <button
            className="layers-panel-delete-btn"
            disabled={!selectedLayer || isIndelible}
            onClick={() => this.onConfirmDelete(selectedLayer)}
            title="Delete Selected Layer"
          >−</button>
          <button
            className="layers-panel-setcurrent-btn"
            disabled={!selectedLayer || selectedLayer.name === currentLayer}
            onClick={() => this.onSetCurrentLayer(selectedLayer)}
            title="Set as Current Layer"
          >✓</button>
        </div>
        <div className="layers-panel-list">
          {layers.map((layer, index) => (
            <Row
              badge={layer.name === currentLayer ? 'current' : undefined}
              colour={this.colourToHex(layer.colour)}
              isCurrent={layer.name === selectedLayer?.name}
              key={index}
              label={layer.name}
              onClick={() => this.onSelectLayer(layer)}
              onColourChange={e => this.onColourChange(layer, e)}
            />
          ))}
        </div>
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
