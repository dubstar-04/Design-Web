import "../../css/StyleSwitcher.css";
import React from "react";

const OPTIONS = [
  { value: 'system', label: 'Follow System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export default function StyleSwitcher({ style, onChange }) {
  return (
    <div className="style-switcher">
      {OPTIONS.map(({ value, label }) => (
        <div
          aria-label={label}
          className={`style-swatch style-swatch--${value}${style === value ? ' selected' : ''}`}
          key={value}
          onClick={() => onChange(value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onChange(value);
            }
          }}
          role="button"
          tabIndex={0}
          title={label}
        />
      ))}
    </div>
  );
}
