import React from 'react';
import './UiverseSwitch.css';

export default function UiverseSwitch({ 
  checked, 
  onChange, 
  id = `uiverse-switch-${Math.random().toString(36).substr(2, 9)}`,
  disabled = false,
  size = 'md'
}) {
  return (
    <label className={`uiverse-switch-container ${size} ${disabled ? 'disabled' : ''}`} htmlFor={id}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange && onChange(e.target.checked)}
      />
      <span className="uiverse-slider"></span>
    </label>
  );
}
