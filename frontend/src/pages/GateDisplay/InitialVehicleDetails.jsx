import React from 'react';
import VehicleDetailsCard from '../../components/VehicleDetailsCard';
import QRCodeVehicleEntry from '../../components/QRCodeVehicleEntry';

const InitialVehicleDetails = ({ vehicle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-4xl w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Vehicle Detected</h2>
          <p className="text-gray-600">Please scan the QR code to proceed</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="bg-gray-50 rounded-xl p-6">
            <VehicleDetailsCard vehicle={vehicle} />
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <QRCodeVehicleEntry vehicleId={vehicle.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialVehicleDetails;