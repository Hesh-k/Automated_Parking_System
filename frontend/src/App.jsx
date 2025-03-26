// src/App.jsx
import React from 'react';
import Home from './pages/Home';
import './index.css';
import AdminPanel from './pages/AdminPanel.jsx';

const App = () => {
  return (
    <div className="app">
      <AdminPanel />
    </div>
  );
};

export default App;