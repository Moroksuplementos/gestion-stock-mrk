// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client'; // Importación para React 18
import App from './App.jsx';
import './index.css'; // Importa los estilos de Tailwind CSS

ReactDOM.createRoot(document.getElementById('root')).render( // Uso de createRoot para React 18
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
