// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import GlobalStyles from './globalStyles';
import { AudioProvider } from './contexts/AudioContext'; // Импортируем AudioProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AudioProvider>
      <GlobalStyles />
      <App />
    </AudioProvider>
  </React.StrictMode>
);
