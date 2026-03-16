import React, { Component } from "react";
import ConfirmationDialog from "./confirmationDialog";
import DialogRow from "./dialogRow";
import Switch from "./switch";
import { SideKickContent, SideKickEdit } from "./sideKick";

export default class TextStylePanel extends Component {
  constructor(props) {
    super(props);
    this.confirmDialogRef = React.createRef();
    this.state = {
      selectedStyle: null,
      selectedStyleName: '',
      confirmDeleteStyle: null,
      editName: '',
      editFont: '',
      editTextHeight: 2.5,
      editUpsideDown: false,
      editBackwards: false,
    };
  }

  componentDidMount() {
    const currentName = this.getCurrentStyle();
    const styles = this.getStyles();
    const current = styles.find(s => s.name === currentName) || styles[0];
    if (current) this.onSelectStyle(current);
  }

  getStyles() {
    return this.props.core.styleManager.getItems();
  }

  getCurrentStyle() {
    return this.props.core.styleManager.getCstyle();
  }

  onNewStyle() {
    this.props.core.styleManager.newItem();
    this.forceUpdate();
  }

  onSelectStyle(style) {
    this.setState({
      selectedStyle: style,
      selectedStyleName: style.name,
      editName: style.name,
      editFont: style.font,
      editTextHeight: style.textHeight,
      editUpsideDown: style.upsideDown,
      editBackwards: style.backwards,
    });
  }

  onSetCurrentStyle(style) {
    this.props.core.styleManager.setCstyle(style.name);
    this.forceUpdate();
  }

  onConfirmDelete(style) {
    this.setState({ confirmDeleteStyle: style }, () => {
      this.confirmDialogRef.current.show();
    });
  }

  onCancelDelete() {
    this.setState({ confirmDeleteStyle: null });
  }

  onDeleteStyle() {
    const { confirmDeleteStyle, selectedStyle } = this.state;
    if (confirmDeleteStyle) {
      const index = this.props.core.styleManager.getItemIndex(confirmDeleteStyle.name);
      this.props.core.styleManager.deleteStyle(index);
      const nextSelected = selectedStyle && selectedStyle.name === confirmDeleteStyle.name ? null : selectedStyle;
      this.setState({ confirmDeleteStyle: null, selectedStyle: nextSelected });
    }
  }

  onNameBlur() {
    const { selectedStyleName, editName } = this.state;
    if (!selectedStyleName) return;
    const index = this.props.core.styleManager.getItemIndex(selectedStyleName);
    if (index >= 0) {
      this.props.core.styleManager.renameStyle(index, editName);
      const actualName = this.props.core.styleManager.getItemByIndex(index).name;
      this.setState({ selectedStyleName: actualName, editName: actualName });
    }
  }

  onNameKeyDown(e) {
    if (e.key === 'Enter') e.target.blur();
  }

  onFontBlur() {
    const { selectedStyle, editFont } = this.state;
    if (!selectedStyle) return;
    const index = this.props.core.styleManager.getItemIndex(selectedStyle.name);
    if (index >= 0) {
      this.props.core.styleManager.updateItem(index, 'font', editFont);
    }
  }

  onFontKeyDown(e) {
    if (e.key === 'Enter') e.target.blur();
  }

  onTextHeightBlur() {
    const { selectedStyle, editTextHeight } = this.state;
    if (!selectedStyle) return;
    const value = parseFloat(editTextHeight);
    if (isNaN(value) || value < 0) return;
    const index = this.props.core.styleManager.getItemIndex(selectedStyle.name);
    if (index >= 0) {
      this.props.core.styleManager.updateItem(index, 'textHeight', value);
      this.setState({ editTextHeight: value });
    }
  }

  onTextHeightKeyDown(e) {
    if (e.key === 'Enter') e.target.blur();
  }

  onToggleChange(field, value) {
    const { selectedStyle } = this.state;
    if (!selectedStyle) return;
    this.setState({ [field]: value }, () => {
      if (field === 'editUpsideDown') selectedStyle.upsideDown = value;
      if (field === 'editBackwards') selectedStyle.backwards = value;
    });
  }

  renderEditPanel() {
    const { editName, editFont, editTextHeight, editUpsideDown, editBackwards, selectedStyle } = this.state;
    const currentStyle = this.getCurrentStyle();
    const indelibleStyles = this.props.core.styleManager.indelibleItems;
    const isIndelible = !selectedStyle || indelibleStyles.some(i => i.toUpperCase() === selectedStyle.name.toUpperCase());

    return (
      <SideKickEdit
        title="Text Style Properties"
        toolbar={
          <>
            <button className="panel-add-btn" onClick={this.onNewStyle.bind(this)} title="New Text Style">+</button>
            <button
              className="panel-delete-btn"
              disabled={!selectedStyle || isIndelible}
              onClick={() => this.onConfirmDelete(selectedStyle)}
              title="Delete Selected Text Style"
            >−</button>
            <button
              className="panel-setcurrent-btn"
              disabled={!selectedStyle || selectedStyle.name === currentStyle}
              onClick={() => this.onSetCurrentStyle(selectedStyle)}
              title="Set as Current Text Style"
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
          label="Font"
          suffix={
            <>
              <input
                className="dialogrow-input dialogrow-input--text"
                list="text-style-panel-fonts"
                onBlur={this.onFontBlur.bind(this)}
                onChange={e => this.setState({ editFont: e.target.value })}
                onKeyDown={this.onFontKeyDown.bind(this)}
                type="text"
                value={editFont}
              />
              <datalist id="text-style-panel-fonts">
                <option value="Arial" />
                <option value="Arial Black" />
                <option value="Comic Sans MS" />
                <option value="Courier New" />
                <option value="Georgia" />
                <option value="Impact" />
                <option value="Lucida Console" />
                <option value="Lucida Sans Unicode" />
                <option value="Palatino Linotype" />
                <option value="Tahoma" />
                <option value="Times New Roman" />
                <option value="Trebuchet MS" />
                <option value="Verdana" />
              </datalist>
            </>
          }
          variant="form"
        />
        <DialogRow
          label="Text Height"
          suffix={
            <input
              className="dialogrow-input dialogrow-input--number"
              min="0"
              onBlur={this.onTextHeightBlur.bind(this)}
              onChange={e => this.setState({ editTextHeight: e.target.value })}
              onKeyDown={this.onTextHeightKeyDown.bind(this)}
              step="0.1"
              type="number"
              value={editTextHeight}
            />
          }
          variant="form"
        />
        <DialogRow
          label="Upside Down"
          suffix={<Switch checked={editUpsideDown} onChange={e => this.onToggleChange('editUpsideDown', e.target.checked)} />}
          variant="form"
        />
        <DialogRow
          label="Backwards"
          suffix={<Switch checked={editBackwards} onChange={e => this.onToggleChange('editBackwards', e.target.checked)} />}
          variant="form"
        />
      </SideKickEdit>
    );
  }

  render() {
    const styles = this.getStyles();
    const currentStyle = this.getCurrentStyle();
    const indelibleStyles = this.props.core.styleManager.indelibleItems;
    const { selectedStyle, confirmDeleteStyle } = this.state;

    return (
      <div className="sidekick-content-panel">
        <SideKickContent>
          <div className="sidekick-content-list">
            {styles.map((style, index) => (
              <DialogRow
                isCurrent={style.name === selectedStyle?.name}
                key={index}
                label={style.name}
                onClick={() => this.onSelectStyle(style)}
                suffix={style.name === currentStyle ? <span className="dialogrow-badge">current</span> : undefined}
              />
            ))}
          </div>
        </SideKickContent>
        {this.renderEditPanel()}
        <ConfirmationDialog
          cancelLabel="Cancel"
          confirmLabel="Delete"
          message={confirmDeleteStyle ? `Delete text style "${confirmDeleteStyle.name}"?` : ''}
          onCancel={this.onCancelDelete.bind(this)}
          onConfirm={this.onDeleteStyle.bind(this)}
          ref={this.confirmDialogRef}
          title="Delete Text Style"
        />
      </div>
    );
  }
}
