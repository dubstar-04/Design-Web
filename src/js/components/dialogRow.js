import "../../css/DialogRow.css";
import React, { Component } from "react";

export default class DialogRow extends Component {
  render() {
    const { variant = 'list', label, subtitle, prefix, suffix, isCurrent, onClick } = this.props;
    const className = `dialogrow dialogrow--${variant}${isCurrent ? ' dialogrow--current' : ''}`;
    const LabelEl = variant === 'form' ? 'label' : 'div';
    const labelEl = label && <LabelEl className="dialogrow-label">{label}</LabelEl>;
    return (
      <div className={className} onClick={onClick}>
        {prefix}
        {subtitle ? (
          <div className="dialogrow-text">
            {labelEl}
            <div className="dialogrow-subtitle">{subtitle}</div>
          </div>
        ) : labelEl}
        {suffix}
      </div>
    );
  }
}
