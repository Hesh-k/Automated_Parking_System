import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminPanel from './pages/admin/AdminPanel';
import WelcomeScreen from './pages/GateDisplay/WelcomeScreen';
import ExitWelcomeScreen from './pages/GateDisplay/ExitWelcomeScreen';
import InitialVehicleDetails from './pages/GateDisplay/InitialVehicleDetails';
import VehicleExitDetails from './pages/GateDisplay/VehicleExitDetails';
import VehicleEntry from './pages/UserWebView/VehicleEntry';
import Payment from './pages/UserWebView/Payment';
import PaymentSuccess from './pages/UserWebView/PaymentSuccess';
import EntryConfirmed from './pages/UserWebView/EntryConfirmed';
import DiscountManagement from './pages/admin/DiscountManagement';
import FrontGateView from './pages/FrontGateView';
import NumberPlate from './pages/NumberPlate';
import './index.css';

         
const dummyParkingDetails = {
  entryTime: '2024-03-26T10:30:00',
  duration: 2, // hours
};

const App = () => (
  <Routes>
    {/* Entry Gate Flow */}
    <Route path="/" element={<WelcomeScreen />} />
      {/*<Route path="/detected" element={<InitialVeh}icleDetails vehicle={dummyVehicle} />} /> */}
    <Route path="/vehicle-entry/:vehicleId" element={<VehicleEntry />} />
    <Route path="/entry-confirmed" element={<EntryConfirmed />} />
    <Route path="/front-gate" element={<FrontGateView />} />
    <Route path="/number-plate" element={<NumberPlate />} />
    <Route path="/" element={<h1 className="text-2xl text-center mt-10">Welcome to Parking System</h1>} />

    
    {/* Exit Gate Flow */}
    <Route path="/exit" element={<ExitWelcomeScreen />} />
    {/*<Route */}
    {/*  path="/exit/:vehicleId" */}
    {/*  element={*/}
    {/*    <VehicleExitDetails */}
    {/*      vehicle={dummyVehicle} */}
    {/*      parkingDetails={dummyParkingDetails}*/}
    {/*    />*/}
    {/*  } */}
    {/*/>*/}
    <Route path="/payment/:vehicleId" element={<Payment />} />
    <Route path="/payment-success" element={<PaymentSuccess />} />
    
    {/* Admin Routes */}
    <Route path="/admin" element={<AdminPanel />} />
    <Route path="/admin/discounts" element={<DiscountManagement />} />
  </Routes>
);

export default App;
