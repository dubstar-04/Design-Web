import "../../css/Dialog.css";
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
        <div className="dialog">
          <p className="confirmation-dialog-text">{message}</p>
          <div className="dialog-buttons">
            <button className="dialog-btn dialog-cancel-btn" onClick={handleCancel} type="button">{cancelLabel}</button>
            <button className="dialog-btn dialog-action-btn dialog-action-btn--confirm" onClick={handleConfirm} type="button">{confirmLabel}</button>
          </div>
        </div>
      </DialogWindow>
    );
  }
}
