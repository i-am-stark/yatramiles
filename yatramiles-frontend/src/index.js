import React from 'react';
import ReactDOM from 'react-dom/client'; // Use the new API
import './index.css';
import App from './App';

// Get the root DOM element
const rootElement = document.getElementById('root');

// Create the React root
const root = ReactDOM.createRoot(rootElement);

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
