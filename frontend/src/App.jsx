import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminPanel from './pages/AdminPanel';
import DiscountManagement from './pages/admin/DiscountManagement';
import Welcome from './pages/Welcome';
import VehicleDetails from './pages/VehicleDetails';
import ExitDetection from './pages/ExitDetection';

// Dummy data for testing
const dummyVehicle = {
  id: 'abc123',
  plate: 'CAD-1123',
  type: 'Car',
};

const dummyParkingDetails = {
  entryTime: '2024-03-26T10:30:00',
  duration: 2, // hours
};

const App = () => (
  <Routes>
    {/* Entry Gate Flow */}
    <Route path="/" element={<Welcome />} />
    <Route path="/vehicle-details/:vehicleId" element={<VehicleDetails />} />
    
    {/* Exit Gate Flow */}
    <Route path="/exit" element={<ExitDetection />} />

    {/* Admin Routes */}
    <Route path="/admin" element={<AdminPanel />} />
    <Route path="/admin/discounts" element={<DiscountManagement />} />
  </Routes>
);

export default App;
