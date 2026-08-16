import React, { useState, useEffect } from 'react';

export default function CountUpNumber({ 
  to, 
  end,
  value,
  target: targetProp,
  from = 0, 
  duration = 1.5, 
  decimals,
  prefix = '', 
  suffix = '',
  className = '',
  style = {}
}) {
  // Resolve target safely across any prop name (to / end / value / target)
  const finalTarget = Number(to ?? end ?? value ?? targetProp ?? 0);
  const safeTarget = isNaN(finalTarget) ? 0 : finalTarget;
  const initial = Number(from) || 0;

  const [current, setCurrent] = useState(initial);

  useEffect(() => {
    let startTimestamp = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      const val = initial + (safeTarget - initial) * easeProgress;
      setCurrent(val);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [safeTarget, initial, duration]);

  let displayValue;
  if (decimals !== undefined) {
    displayValue = current.toFixed(decimals);
  } else if (Number.isInteger(safeTarget)) {
    displayValue = Math.round(current);
  } else {
    displayValue = current.toFixed(1);
  }

  return (
    <span className={`count-up-number ${className}`} style={{ fontVariantNumeric: 'tabular-nums', ...style }}>
      {prefix}{displayValue}{suffix}
    </span>
  );
}
