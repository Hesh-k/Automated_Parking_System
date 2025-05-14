import { Routes, Route } from 'react-router-dom';
import AdminPanelLoginForm from './components/admin/AdminPanelLogin';
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
    <Route path="/" element={<WelcomeScreen />} />
    <Route path="/detected" element={<InitialVehicleDetails vehicle={dummyVehicle} />} />
    <Route path="/vehicle-entry/:vehicleId" element={<VehicleEntry />} />
    <Route path="/entry-confirmed" element={<EntryConfirmed />} />
    
    {/* Exit Gate Flow */}
    <Route path="/exit" element={<ExitWelcomeScreen />} />
    <Route 
      path="/exit/:vehicleId" 
      element={
        <VehicleExitDetails 
          vehicle={dummyVehicle} 
          parkingDetails={dummyParkingDetails}
        />
      } 
    />
    <Route path="/payment/:vehicleId" element={<Payment />} />
    <Route path="/payment-success" element={<PaymentSuccess />} />

    {/* Admin Routes */}
    <Route path="/admin" element={<AdminPanel />} />
    <Route path="/admin/discounts" element={<DiscountManagement />} />
    <Route path="/admin-login" element={<AdminPanelLoginForm />} />
  </Routes>
);

export default App;
