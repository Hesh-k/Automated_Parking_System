import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FrontGateView from './pages/FrontGateView';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/front-gate" element={<FrontGateView />} />
          <Route path="/" element={<h1>Welcome to Parking System</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;