import "../../css/LayersWindow.css";
import React, { Component } from "react";
import ConfirmationDialog from "./confirmationDialog";
import DialogWindow from "./dialogWindow";
import DialogRowMenu from "./dialogRowMenu";
import Row from "./dialogRow";


export default class LayersWindow extends Component {
  constructor(props) {
    super(props);

    this.baseWindowRef = React.createRef();
    this.confirmDialogRef = React.createRef();
    this.state = {
      editingLayer: null,
      editingLayerName: '',
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

  toggleVisibility() {
    this.baseWindowRef.current.toggleVisibility();
  }

  close() {
    this.baseWindowRef.current.close();
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

  onSetCurrentLayer(layer) {
    this.props.core.layerManager.setCstyle(layer.name);
    this.forceUpdate();
  }

  onEditLayer(layer) {
    this.setState({
      editingLayer: layer,
      editingLayerName: layer.name,
      editName: layer.name,
      editOn: layer.on,
      editFrozen: layer.frozen,
      editLocked: layer.locked,
      editLineType: layer.lineType,
      editLineWeight: layer.lineWeight,
      editPlotting: layer.plotting,
    });
  }

  onBackFromEdit() {
    this.setState({ editingLayer: null });
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
    const { confirmDeleteLayer, editingLayer } = this.state;
    if (confirmDeleteLayer) {
      const index = this.props.core.layerManager.getItemIndex(confirmDeleteLayer.name);
      this.props.core.layerManager.deleteStyle(index);
      const nextEditing = editingLayer && editingLayer.name === confirmDeleteLayer.name ? null : editingLayer;
      this.setState({ confirmDeleteLayer: null, editingLayer: nextEditing });
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
    const { editingLayerName, editName } = this.state;
    if (!editingLayerName) return;
    const index = this.props.core.layerManager.getItemIndex(editingLayerName);
    if (index >= 0) {
      this.props.core.layerManager.renameStyle(index, editName);
      // Read back the actual stored name (getUniqueName may have changed it)
      const actualName = this.props.core.layerManager.getItemByIndex(index).name;
      this.setState({ editingLayerName: actualName, editName: actualName });
    }
  }


  onNameKeyDown(e) {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  }

  onToggleChange(field, value) {
    const { editingLayer } = this.state;
    if (!editingLayer) return;
    this.setState({ [field]: value }, () => {
      if (field === 'editOn') editingLayer.on = value;
      if (field === 'editFrozen') editingLayer.frozen = value;
      if (field === 'editLocked') editingLayer.locked = value;
      if (field === 'editPlotting') editingLayer.plotting = value;
      if (field === 'editLineType') editingLayer.lineType = value;
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
      <div className="layers-edit-panel">
        <div className="layers-edit-form">
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
      </div>
    );
  }

  renderLayerList() {
    const layers = this.getLayers();
    const currentLayer = this.getCurrentLayer();
    const indelibleLayers = this.props.core.layerManager.indelibleItems;
    return (
      <div className="layers-list">
        {layers.map((layer, index) => (
          <Row
            actions={
              <DialogRowMenu
                isCurrent={layer.name === currentLayer}
                isIndelible={indelibleLayers.some(i => i.toUpperCase() === layer.name.toUpperCase())}
                onDelete={() => this.onConfirmDelete(layer)}
                onEdit={() => this.onEditLayer(layer)}
                onSetCurrent={() => this.onSetCurrentLayer(layer)}
              />
            }
            badge={layer.name === currentLayer ? 'current' : undefined}
            colour={this.colourToHex(layer.colour)}
            isCurrent={layer.name === currentLayer}
            key={index}
            label={layer.name}
            onColourChange={e => this.onColourChange(layer, e)}
          />
        ))}
      </div>
    );
  }

  render() {
    const { editingLayer, confirmDeleteLayer } = this.state;
    const isEditing = !!editingLayer;
    return (
      <>
        <DialogWindow
          onAdd={isEditing ? undefined : this.onNewLayer.bind(this)}
          onBack={isEditing ? this.onBackFromEdit.bind(this) : undefined}
          ref={this.baseWindowRef}
          title="Layers"
        >
          {editingLayer
            ? this.renderEditPanel()
            : this.renderLayerList()
          }
        </DialogWindow>
        <ConfirmationDialog
          cancelLabel="Cancel"
          confirmLabel="Delete"
          message={confirmDeleteLayer ? `Delete layer "${confirmDeleteLayer.name}"?` : ''}
          onCancel={this.onCancelDelete.bind(this)}
          onConfirm={this.onDeleteLayer.bind(this)}
          ref={this.confirmDialogRef}
          title="Delete Layer"
        />
      </>
    );
  }
}
