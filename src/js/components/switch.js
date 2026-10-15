import "../../css/Switch.css";
import React from "react";

export default function Switch({ checked, onChange, disabled, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy }) {
  return (
    <label className={`switch${disabled ? ' switch--disabled' : ''}`}>
      <input
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        type="checkbox"
      />
      <span className="slider round" />
    </label>
  );
}
