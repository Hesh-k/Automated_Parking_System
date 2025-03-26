import React from 'react';
import QRCode from 'react-qr-code';

const PaymentQRCode = ({ vehicleId, amount, parkingDetails }) => {
  // Generate the payment URL with all necessary details
  const baseUrl = window.location.origin;
  const paymentUrl = `${baseUrl}/payment/${vehicleId}`;
  
  // Create payment data to be encoded in QR
  const paymentData = {
    vehicleId,
    amount,
    entryTime: parkingDetails.entryTime,
    duration: parkingDetails.duration,
    timestamp: new Date().toISOString()
  };

  // Encode payment data in the URL
  const encodedData = encodeURIComponent(JSON.stringify(paymentData));
  const fullPaymentUrl = `${paymentUrl}?data=${encodedData}`;

  return (
    <div className="flex flex-col items-center">
      <div className="p-4 bg-white shadow-md rounded-xl">
        <QRCode value={fullPaymentUrl} size={200} />
      </div>
      <div className="mt-4 space-y-2">
        <p className="text-2xl font-bold text-gray-800">
          ${amount.toFixed(2)}
        </p>
        <p className="text-sm text-gray-500">
          Scan with your mobile banking app
        </p>
      </div>
    </div>
  );
};

export default PaymentQRCode; 