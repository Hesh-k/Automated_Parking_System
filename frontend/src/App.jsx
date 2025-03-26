import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FrontGateView from './pages/FrontGateView';
import NumberPlate from './pages/NumberPlate';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/front-gate" element={<FrontGateView />} />
          <Route path="/number-plate" element={<NumberPlate />} />
          <Route path="/" element={<h1 className="text-2xl text-center mt-10">Welcome to Parking System</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;