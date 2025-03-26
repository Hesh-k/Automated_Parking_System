import React from 'react';
import QRCode from 'react-qr-code';

const QRCodeVehicleEntry = ({ value }) => {
  return (
    <div className="mt-6">
      <p className="text-gray-700 text-center">Scan to continue:</p>
      <div className="p-4 bg-white shadow-md rounded-xl inline-block">
        <QRCode value={value} size={128} />
      </div>
    </div>
  );
};

export default QRCodeVehicleEntry;
