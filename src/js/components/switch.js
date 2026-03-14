import "../../css/Switch.css";
import React from "react";

export default function Switch({ checked, onChange }) {
  return (
    <label className="switch">
      <input checked={checked} onChange={onChange} type="checkbox" />
      <span className="slider round" />
    </label>
  );
}
