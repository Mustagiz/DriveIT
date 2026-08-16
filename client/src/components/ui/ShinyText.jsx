import React from 'react';
import './ShinyText.css';

export default function ShinyText({ 
  text, 
  disabled = false, 
  speed = 4, 
  className = '',
  style = {}
}) {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`shiny-text ${disabled ? 'disabled' : ''} ${className}`}
      style={{ animationDuration, ...style }}
    >
      {text}
    </span>
  );
}
