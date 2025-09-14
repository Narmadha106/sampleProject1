import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { OrganProvider } from './context/OrganContext'; // ✅ import the provider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <OrganProvider>  {/* ✅ Wrap the app with provider */}
      <App />
    </OrganProvider>
  </React.StrictMode>
);

reportWebVitals();
