import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getVehicleByPlate, processPayment } from '../services/vehicleService';

const PaymentPage = () => {
  const { plateNumber } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getVehicleByPlate(plateNumber)
      .then((v) => {
        setVehicle(v);
        setPaid(v.paymentStatus === 'paid');
        setLoading(false);
      })
      .catch(() => { setError('Vehicle not found'); setLoading(false); });
  }, [plateNumber]);

  const handlePay = async () => {
    try {
      await processPayment(plateNumber);
      setPaid(true);
    } catch {
      setError('Payment failed.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Payment for {plateNumber}</h2>
        <p className="mb-2">Amount to Pay: <span className="font-semibold">${vehicle?.currentCharge || vehicle?.charge || '...'}</span></p>
        {paid ? (
          <div className="text-green-700 text-xl font-bold mt-8">
            Payment completed!<br />You can now exit.<br />Thank you, come again.
          </div>
        ) : (
          <button
            onClick={handlePay}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg"
            disabled={paid}
          >
            Pay Now
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentPage; 