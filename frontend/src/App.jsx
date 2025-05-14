import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminPanel from './pages/AdminPanel';
import DiscountManagement from './pages/admin/DiscountManagement';
import Welcome from './pages/Welcome';
import VehicleDetails from './pages/VehicleDetails';
import ExitDetection from './pages/ExitDetection';
import PaymentPage from './pages/PaymentPage';
import { fetchAndStoreAllDataToLocalStorage, storeFirebaseDataAsCookie } from './services/vehicleService';

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

const App = () => {
  useEffect(() => {
    // Function to fetch and update localStorage and cookie
    const fetchAndUpdate = () => {
      fetchAndStoreAllDataToLocalStorage().then(() => {
        storeFirebaseDataAsCookie();
      });
    };
    fetchAndUpdate(); // Initial fetch
    const interval = setInterval(fetchAndUpdate, 5000); // Every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <Routes>
      {/* Entry Gate Flow */}
      <Route path="/" element={<Welcome />} />
      <Route path="/vehicle-details/:vehicleId" element={<VehicleDetails />} />
      
      {/* Exit Gate Flow */}
      <Route path="/exit" element={<ExitDetection />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/admin/discounts" element={<DiscountManagement />} />

      {/* Payment Route */}
      <Route path="/payment/:plateNumber" element={<PaymentPage />} />
    </Routes>
  );
};

export default App;
