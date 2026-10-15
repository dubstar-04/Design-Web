import "../../css/Switch.css";
import React from "react";

export default function Switch({ checked, onChange, disabled }) {
  return (
    <label className={`switch${disabled ? ' switch--disabled' : ''}`}>
      <input
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        type="checkbox"
      />
      <span className="slider round" />
    </label>
  );
}
