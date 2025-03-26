import React from 'react';

const VehicleDetailsCard = ({ vehicle }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Vehicle Detected</h2>
      <p className="text-lg text-gray-700"><strong>Plate:</strong> {vehicle.plate}</p>
      <p className="text-lg text-gray-700"><strong>Type:</strong> {vehicle.type}</p>
    </div>
  );
};

export default VehicleDetailsCard;