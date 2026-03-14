import "../../css/DialogRow.css";
import React, { Component } from "react";
import ColourButton from "./colourButton";

export default class DialogRow extends Component {
  render() {
    const { variant = 'list', label, colour, onColourChange, badge, actions, isCurrent, checked, onChange, onClick, children } = this.props;
    const className = `dialogrow dialogrow--${variant}${isCurrent ? ' dialogrow--current' : ''}`;
    const LabelEl = variant === 'form' ? 'label' : 'div';
    return (
      <div className={className} onClick={onClick}>
        {colour !== undefined && (
          onColourChange
            ? <input
                className="dialogrow-colour-input"
                onChange={onColourChange}
                title="Change colour"
                type="color"
                value={colour}
              />
            : <ColourButton colour={colour} />
        )}
        {label && <LabelEl className="dialogrow-label">{label}</LabelEl>}
        {children}
        {checked !== undefined && (
          <label className="switch">
            <input checked={checked} onChange={onChange} type="checkbox" />
            <span className="slider round" />
          </label>
        )}
        {badge && <span className="dialogrow-badge">{badge}</span>}
        {actions && <div className="dialogrow-actions">{actions}</div>}
      </div>
    );
  }
}
