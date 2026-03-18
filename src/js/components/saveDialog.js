import "../../css/Dialog.css";
import "../../css/SaveDialog.css";
import React, { Component } from "react";
import DialogWindow from "./dialogWindow";

export default class SaveDialog extends Component {
  constructor(props) {
    super(props);
    this.state = { filename: '' };
    this.dialogRef = React.createRef();
    this.inputRef = React.createRef();
  }

  show(currentFilename) {
    const filename = `${currentFilename || 'design'}.dxf`;
    this.setState({ filename }, () => {
      this.dialogRef.current.toggleVisibility();
      requestAnimationFrame(() => {
        if (this.inputRef.current) {
          this.inputRef.current.focus();
          // Select only the stem, not the .dxf extension
          this.inputRef.current.setSelectionRange(0, filename.length - 4);
        }
      });
    });
  }

  close() {
    this.dialogRef.current.close();
  }

  handleSave() {
    // Strip any extension the user may have typed and enforce .dxf
    const stem = (this.state.filename.trim() || 'design').replace(/\.[^.]+$/, '');
    const filename = `${stem || 'design'}.dxf`;
    this.close();
    this.props.onSave && this.props.onSave(filename);
  }

  handleKeyDown(e) {
    if (e.key === 'Enter') this.handleSave();
    if (e.key === 'Escape') this.close();
  }

  render() {
    return (
      <DialogWindow className="dialogwindow--narrow" ref={this.dialogRef} title="Save File">
        <div className="dialog">
          <input
            className="save-dialog-input"
            onChange={(e) => this.setState({ filename: e.target.value })}
            onKeyDown={this.handleKeyDown.bind(this)}
            placeholder="design.dxf"
            ref={this.inputRef}
            type="text"
            value={this.state.filename}
          />
          <div className="dialog-buttons">
            <button className="dialog-btn dialog-cancel-btn" onClick={this.close.bind(this)} type="button">Cancel</button>
            <button className="dialog-btn dialog-action-btn dialog-action-btn--save" onClick={this.handleSave.bind(this)} type="button">Save</button>
          </div>
        </div>
      </DialogWindow>
    );
  }
}
