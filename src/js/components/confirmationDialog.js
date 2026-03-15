import "../../css/ConfirmationDialog.css";
import React, { Component } from "react";
import DialogWindow from "./dialogWindow";

export default class ConfirmationDialog extends Component {
  constructor(props) {
    super(props);
    this.dialogRef = React.createRef();
  }

  show() {
    this.dialogRef.current.toggleVisibility();
  }

  close() {
    this.dialogRef.current.close();
  }

  render() {
    const { title = "Confirm", message, confirmLabel = "Confirm", cancelLabel = "Cancel", onConfirm, onCancel } = this.props;

    const handleConfirm = () => {
      this.close();
      onConfirm && onConfirm();
    };

    const handleCancel = () => {
      this.close();
      onCancel && onCancel();
    };

    return (
      <DialogWindow className="dialogwindow--narrow" ref={this.dialogRef} title={title}>
        <div className="confirmation-dialog">
          <p className="confirmation-dialog-text">{message}</p>
          <div className="confirmation-dialog-buttons">
            <button className="confirmation-dialog-cancel-btn" onClick={handleCancel} type="button">{cancelLabel}</button>
            <button className="confirmation-dialog-confirm-btn" onClick={handleConfirm} type="button">{confirmLabel}</button>
          </div>
        </div>
      </DialogWindow>
    );
  }
}
