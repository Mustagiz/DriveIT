import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { registerServiceWorker } from './utils/pushNotifications.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Register PWA service worker after app mounts
registerServiceWorker().then((reg) => {
  if (reg) console.log('[DriveIT] Service Worker ready');
});
