import "../../css/Toast.css";
import React, { Component } from "react";

export default class Toast extends Component {
  render() {
    const { toasts } = this.props;

    if (!toasts || toasts.length === 0) return null;

    return (
      <div className="toast-container">
        {toasts.map((toast) => (
          <div className="toast" key={toast.id}>
            {toast.message}
          </div>
        ))}
      </div>
    );
  }
}
