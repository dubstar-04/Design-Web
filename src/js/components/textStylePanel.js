import React, { Component } from "react";
import ConfirmationDialog from "./confirmationDialog";
import DialogRow from "./dialogRow";
import Switch from "./switch";
import { SideKickContent, SideKickEdit } from "./sideKick";

export default class TextStylePanel extends Component {
  constructor(props) {
    super(props);
    this.confirmDialogRef = React.createRef();
    this.state = this.getInitialState();
  }

  // Only in-progress edits are buffered; the selected style is resolved from the active manager on render.
  getInitialState() {
    return {
      selectedName: null,
      confirmDeleteName: null,
      editName: null,
      editFont: null,
      editTextHeight: null,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.core !== this.props.core || prevProps.revision !== this.props.revision) {
      this.setState(this.getInitialState());
    }
  }

  getSelectedStyle() {
    const styles = this.getStyles();
    const current = this.getCurrentStyle();
    return styles.find(s => s.name === this.state.selectedName) ||
      styles.find(s => s.name === current) ||
      styles[0];
  }

  getStyles() {
    return this.props.core.styleManager.getItems();
  }

  getCurrentStyle() {
    return this.props.core.styleManager.getCstyle();
  }

  onNewStyle() {
    this.props.core.styleManager.newItem();
    const styles = this.getStyles();
    const newStyle = styles[styles.length - 1];
    this.setState({ selectedName: newStyle?.name ?? null, editName: null, editFont: null, editTextHeight: null });
  }

  onSelectStyle(style) {
    this.setState({ selectedName: style.name, editName: null, editFont: null, editTextHeight: null });
  }

  onSetCurrentStyle(style) {
    this.props.core.styleManager.setCstyle(style.name);
    this.forceUpdate();
  }

  onConfirmDelete(style) {
    this.setState({ confirmDeleteName: style.name }, () => {
      this.confirmDialogRef.current.show();
    });
  }

  onCancelDelete() {
    this.setState({ confirmDeleteName: null });
  }

  onDeleteStyle() {
    const { confirmDeleteName } = this.state;
    if (confirmDeleteName) {
      const index = this.props.core.styleManager.getItemIndex(confirmDeleteName);
      if (index >= 0) this.props.core.styleManager.deleteStyle(index);
      this.setState({ confirmDeleteName: null, selectedName: null, editName: null, editFont: null, editTextHeight: null });
    }
  }

  onNameBlur() {
    const { editName } = this.state;
    const style = this.getSelectedStyle();
    if (!style || editName === null) return;
    const index = this.props.core.styleManager.getItemIndex(style.name);
    if (index >= 0) {
      this.props.core.styleManager.renameStyle(index, editName);
      this.setState({ selectedName: this.props.core.styleManager.getItemByIndex(index).name, editName: null });
    }
  }

  onNameKeyDown(e) {
    if (e.key === 'Enter') e.target.blur();
  }

  onFontBlur() {
    const { editFont } = this.state;
    const style = this.getSelectedStyle();
    this.setState({ editFont: null });
    if (!style || editFont === null) return;
    const index = this.props.core.styleManager.getItemIndex(style.name);
    if (index >= 0) {
      this.props.core.styleManager.updateItem(index, 'font', editFont);
    }
  }

  onFontKeyDown(e) {
    if (e.key === 'Enter') e.target.blur();
  }

  onTextHeightBlur() {
    const { editTextHeight } = this.state;
    const style = this.getSelectedStyle();
    this.setState({ editTextHeight: null });
    if (!style || editTextHeight === null) return;
    const value = parseFloat(editTextHeight);
    if (isNaN(value) || value < 0) return;
    const index = this.props.core.styleManager.getItemIndex(style.name);
    if (index >= 0) {
      this.props.core.styleManager.updateItem(index, 'textHeight', value);
    }
  }

  onTextHeightKeyDown(e) {
    if (e.key === 'Enter') e.target.blur();
  }

  setStyleValue(prop, value) {
    const style = this.getSelectedStyle();
    if (!style) return;
    style[prop] = value;
    this.forceUpdate();
  }

  renderEditPanel() {
    const { editName, editFont, editTextHeight } = this.state;
    const selectedStyle = this.getSelectedStyle();
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
              value={editName ?? selectedStyle?.name ?? ''}
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
                value={editFont ?? selectedStyle?.font ?? ''}
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
              value={editTextHeight ?? selectedStyle?.textHeight ?? ''}
            />
          }
          variant="form"
        />
        <DialogRow
          label="Upside Down"
          suffix={<Switch checked={!!selectedStyle?.upsideDown} onChange={e => this.setStyleValue('upsideDown', e.target.checked)} />}
          variant="form"
        />
        <DialogRow
          label="Backwards"
          suffix={<Switch checked={!!selectedStyle?.backwards} onChange={e => this.setStyleValue('backwards', e.target.checked)} />}
          variant="form"
        />
      </SideKickEdit>
    );
  }

  render() {
    const styles = this.getStyles();
    const currentStyle = this.getCurrentStyle();
    const { confirmDeleteName } = this.state;
    const selectedStyle = this.getSelectedStyle();

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
          message={confirmDeleteName ? `Delete text style "${confirmDeleteName}"?` : ''}
          onCancel={this.onCancelDelete.bind(this)}
          onConfirm={this.onDeleteStyle.bind(this)}
          ref={this.confirmDialogRef}
          title="Delete Text Style"
        />
      </div>
    );
  }
}
