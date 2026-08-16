import React from 'react';
import './WifiLoader.css';

export default function WifiLoader({ 
  loading = true, 
  text = 'connecting...', 
  overlay = true 
}) {
  if (!loading) return null;

  const loaderContent = (
    <div id="wifi-loader">
      {/* Outer Circle Ring */}
      <svg className="circle-outer" viewBox="0 0 86 86">
        <circle className="back" cx="43" cy="43" r="40"></circle>
        <circle className="front" cx="43" cy="43" r="40"></circle>
        <circle className="new" cx="43" cy="43" r="40"></circle>
      </svg>

      {/* Middle Circle Ring */}
      <svg className="circle-middle" viewBox="0 0 60 60">
        <circle className="back" cx="30" cy="30" r="27"></circle>
        <circle className="front" cx="30" cy="30" r="27"></circle>
      </svg>

      {/* Inner Circle Ring */}
      <svg className="circle-inner" viewBox="0 0 34 34">
        <circle className="back" cx="17" cy="17" r="14"></circle>
        <circle className="front" cx="17" cy="17" r="14"></circle>
      </svg>

      {/* Animated Text */}
      <div className="text" data-text={text}></div>
    </div>
  );

  if (overlay) {
    return (
      <div className="wifi-loader-overlay">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
}
