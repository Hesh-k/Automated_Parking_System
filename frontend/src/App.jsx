import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminPanel from './pages/AdminPanel';
import DiscountManagement from './pages/admin/DiscountManagement';
import Welcome from './pages/Welcome';
import VehicleDetails from './pages/VehicleDetails';
import ExitDetection from './pages/ExitDetection';
import PaymentPage from './pages/PaymentPage';
import GateOpen from './pages/GateOpen';
import AdminVehicles from './pages/AdminVehicles';
import { fetchAndStoreAllDataToLocalStorage, storeFirebaseDataAsCookie } from './services/vehicleService';


const App = () => {
  const [cookieValue, setCookieValue] = useState('');

  useEffect(() => {
    // Function to fetch and update localStorage and cookie
    const fetchAndUpdate = () => {
      fetchAndStoreAllDataToLocalStorage().then(() => {
        storeFirebaseDataAsCookie();
        // Log and update state for UI
        const match = document.cookie.match(/(?:^|; )firebase_data=([^;]*)/);
        if (match) {
          const decoded = decodeURIComponent(match[1]);
          setCookieValue(decoded);
          console.log('Cookie updated:', decoded);
        } else {
          setCookieValue('');
          console.log('Cookie not found');
        }
      });
    };
    fetchAndUpdate(); // Initial fetch
    const interval = setInterval(fetchAndUpdate, 2000); // Every 2 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      
      <Routes>
        {/* Entry Gate Flow */}
        <Route path="/" element={<Welcome />} />
        <Route path="/vehicle-details/:vehicleId" element={<VehicleDetails />} />
        
        {/* Exit Gate Flow */}
        <Route path="/exit" element={<ExitDetection />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/discounts" element={<DiscountManagement />} />
        <Route path="/admin/vehicles" element={<AdminVehicles />} />

        {/* Payment Route */}
        <Route path="/payment/:plateNumber" element={<PaymentPage />} />

        {/* New Gate Open Route */}
        <Route path="/gate-open" element={<GateOpen />} />
      </Routes>
    </>
  );
};

export default App;
