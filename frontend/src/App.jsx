import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminPanel from './pages/AdminPanel';
import WelcomeScreen from './pages/GateDisplay/WelcomeScreen';
import InitialVehicleDetails from './pages/GateDisplay/InitialVehicleDetails';
import VehicleInfoForm from './pages/UserWebView/VehicleInfoForm';

const dummyVehicle = {
  id: 'abc123',
  plate: 'CAD-1123',
  type: 'Car',
};

const App = () => (
  <Routes>
    <Route path="/" element={<WelcomeScreen />} />
    <Route path="/detected" element={<InitialVehicleDetails vehicle={dummyVehicle} />} />
    <Route path="/vehicle-info/:id" element={<VehicleInfoForm vehicle={dummyVehicle} />} />
    <Route path="/admin" element={<AdminPanel />} />
  </Routes>
);

export default App;
