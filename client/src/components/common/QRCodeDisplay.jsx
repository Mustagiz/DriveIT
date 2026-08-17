import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

export default function QRCodeDisplay({
  value,
  size = 120,
  darkColor = '#000000',
  lightColor = '#FFFFFF',
  className = '',
  style = {},
  alt = 'Scan QR Code'
}) {
  const [dataUrl, setDataUrl] = useState('');

  useEffect(() => {
    if (!value) return;

    const qrValue = typeof value === 'object' ? JSON.stringify(value) : String(value);

    QRCode.toDataURL(qrValue, {
      width: size * 2, // 2x for retina crispness
      margin: 1,
      color: {
        dark: darkColor,
        light: lightColor
      },
      errorCorrectionLevel: 'M'
    })
      .then((url) => {
        setDataUrl(url);
      })
      .catch((err) => {
        console.error('Error generating QR code:', err);
      });
  }, [value, size, darkColor, lightColor]);

  if (!dataUrl) {
    return (
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          background: lightColor,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style
        }}
        className={className}
      >
        <span style={{ fontSize: '10px', color: '#94A3B8' }}>Generating...</span>
      </div>
    );
  }

  return (
    <img
      src={dataUrl}
      alt={alt}
      width={size}
      height={size}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'block',
        borderRadius: '8px',
        objectFit: 'contain',
        imageRendering: 'pixelated',
        ...style
      }}
      className={className}
    />
  );
}
