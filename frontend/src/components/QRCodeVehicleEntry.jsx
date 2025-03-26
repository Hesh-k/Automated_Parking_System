import React from 'react';
import QRCode from 'react-qr-code';

const QRCodeVehicleEntry = ({ vehicleId }) => {
  // Generate the full URL including the host
  const baseUrl = window.location.origin;
  const entryUrl = `${baseUrl}/vehicle-entry/${vehicleId}`;

  return (
    <div className="mt-6">
      <p className="text-gray-700 text-center mb-4">Scan QR code to enter details:</p>
      <div className="p-4 bg-white shadow-md rounded-xl inline-block">
        <QRCode value={entryUrl} size={200} />
      </div>
      <p className="text-sm text-gray-500 mt-4">
        Vehicle ID: {vehicleId}
      </p>
    </div>
  );
};

export default QRCodeVehicleEntry;
