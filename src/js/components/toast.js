import "../../css/Toast.css";
import React, { Component } from "react";

const DISMISS_DELAY = 3000;
const HOVER_DISMISS_DELAY = 1000;

export default class Toast extends Component {
  constructor(props) {
    super(props);
    this.timers = new Map();
  }

  componentDidMount() {
    this.startTimersForNewToasts([], this.props.toasts);
  }

  componentDidUpdate(prevProps) {
    this.startTimersForNewToasts(prevProps.toasts, this.props.toasts);
    // Clear timers for toasts that were removed externally
    prevProps.toasts.forEach((toast) => {
      if (!this.props.toasts.find((t) => t.id === toast.id)) {
        clearTimeout(this.timers.get(toast.id));
        this.timers.delete(toast.id);
      }
    });
  }

  componentWillUnmount() {
    this.timers.forEach((timerId) => clearTimeout(timerId));
    this.timers.clear();
  }

  startTimersForNewToasts(prevToasts, nextToasts) {
    nextToasts.forEach((toast) => {
      if (!this.timers.has(toast.id) && !prevToasts.find((t) => t.id === toast.id)) {
        this.scheduleDismiss(toast.id, DISMISS_DELAY);
      }
    });
  }

  scheduleDismiss(id, delay) {
    const timerId = setTimeout(() => {
      this.timers.delete(id);
      this.props.removeToast(id);
    }, delay);
    this.timers.set(id, timerId);
  }

  handleMouseEnter(id) {
    clearTimeout(this.timers.get(id));
    this.timers.delete(id);
  }

  handleMouseLeave(id) {
    this.scheduleDismiss(id, HOVER_DISMISS_DELAY);
  }

  render() {
    const { toasts } = this.props;

    if (!toasts || toasts.length === 0) return null;

    return (
      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            className="toast"
            key={toast.id}
            onMouseEnter={() => this.handleMouseEnter(toast.id)}
            onMouseLeave={() => this.handleMouseLeave(toast.id)}
          >
            {toast.message}
          </div>
        ))}
      </div>
    );
  }
}
