import React from 'react';
import QRCodeVehicleEntry from '../../components/QRCodeVehicleEntry';

const InitialVehicleDetails = ({ vehicle }) => {
  const qrLink = `/vehicle-info/${vehicle.id}`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Vehicle Detected</h2>
        <p className="text-lg text-gray-700 mb-2"><strong>Plate:</strong> {vehicle.plate}</p>
        <p className="text-lg text-gray-700"><strong>Type:</strong> {vehicle.type}</p>
        <div className="mt-6">
          <QRCodeVehicleEntry value={qrLink} />
        </div>
      </div>
    </div>
  );
};

export default InitialVehicleDetails;