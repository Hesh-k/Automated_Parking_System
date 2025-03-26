import React from 'react';
import VehicleDetailsCard from '../../components/VehicleDetailsCard';
import QRCodeVehicleEntry from '../../components/QRCodeVehicleEntry';

const InitialVehicleDetails = ({ vehicle }) => {
  const qrLink = `https://yourwebapp.com/vehicle-info/${vehicle.id}`;

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-green-50 space-y-6">
      <VehicleDetailsCard vehicle={vehicle} />
      <QRCodeVehicleEntry value={qrLink} />
    </div>
  );
};

export default InitialVehicleDetails;