import "../../css/DialogRow.css";
import React, { Component } from "react";

export default class DialogRow extends Component {
  render() {
    const { variant = 'list', label, prefix, suffix, isCurrent, onClick } = this.props;
    const className = `dialogrow dialogrow--${variant}${isCurrent ? ' dialogrow--current' : ''}`;
    const LabelEl = variant === 'form' ? 'label' : 'div';
    return (
      <div className={className} onClick={onClick}>
        {prefix}
        {label && <LabelEl className="dialogrow-label">{label}</LabelEl>}
        {suffix}
      </div>
    );
  }
}
