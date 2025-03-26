import React from 'react';
import { create } from 'zustand';
import WelcomeScreen from './pages/GateDisplay/WelcomeScreen';
import InitialVehicleDetails from './pages/GateDisplay/InitialVehicleDetails';
import VehicleInfoForm from './pages/UserWebView/VehicleInfoForm';

const useAppStore = create((set) => ({
  vehicleDetected: false,
  scannedQR: false,
  vehicle: {
    id: 'abc123',
    plate: 'CAD-1123',
    type: 'Car',
  },
  setVehicleDetected: (value) => set({ vehicleDetected: value }),
  setScannedQR: (value) => set({ scannedQR: value }),
}));

function App() {
  const {
    vehicleDetected,
    scannedQR,
    vehicle,
    setVehicleDetected,
    setScannedQR,
  } = useAppStore();

  if (scannedQR) return <VehicleInfoForm vehicle={vehicle} />;
  if (vehicleDetected) return <InitialVehicleDetails vehicle={vehicle} />;

  return (
    <div>
      <WelcomeScreen />
      {/* Simulation Controls */}
      <div className="fixed bottom-5 left-5 flex gap-4">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => setVehicleDetected(true)}
        >
          Simulate Vehicle Detection
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => {
            setVehicleDetected(false);
            setScannedQR(true);
          }}
        >
          Simulate QR Scan
        </button>
      </div>
    </div>
  );
}

export default App;
