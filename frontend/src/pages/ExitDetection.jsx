import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { getVehicleByPlate } from '../services/vehicleService';
import OpeningGate from '../components/OpeningGate';

const ExitDetection = () => {
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleDetails, setVehicleDetails] = useState(null);
  const [error, setError] = useState('');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const vehicle = await getVehicleByPlate(plateNumber);
      setVehicleDetails(vehicle);
      setError('');
      pollPaymentStatus(plateNumber);
    } catch (err) {
      setError('Vehicle not found in parking lot');
      setVehicleDetails(null);
    }
  };

  const calculateFees = () => {
    if (!vehicleDetails) return 0;
    const entryTime = new Date(vehicleDetails.entryTime);
    const exitTime = new Date();
    const hours = (exitTime - entryTime) / (1000 * 60 * 60);
    const baseRate = 5; // $5 per hour
    return (hours * baseRate).toFixed(2);
  };

  const pollPaymentStatus = async (plate) => {
    try {
      const vehicle = await getVehicleByPlate(plate);
      if (vehicle.paymentStatus === 'paid') {
        setPaymentConfirmed(true);
        setTimeout(() => setShowGate(true), 1000);
      } else {
        setTimeout(() => pollPaymentStatus(plate), 2000);
      }
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Exit Detection</h2>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="plateNumber" className="block text-sm font-medium text-gray-700">
                Enter Vehicle Plate Number
              </label>
              <input
                type="text"
                id="plateNumber"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Search Vehicle
            </button>
          </form>

          {error && (
            <div className="mt-4 text-red-600 text-center">{error}</div>
          )}

          {vehicleDetails && !paymentConfirmed && (
            <div className="mt-8 grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle Details</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Plate Number:</span> {vehicleDetails.plate}</p>
                  <p><span className="font-medium">Type:</span> {vehicleDetails.type}</p>
                  <p><span className="font-medium">Entry Time:</span> {new Date(vehicleDetails.entryTime).toLocaleString()}</p>
                  <p><span className="font-medium">Exit Time:</span> {vehicleDetails.exitTime ? new Date(vehicleDetails.exitTime).toLocaleString() : '-'}</p>
                  <p><span className="font-medium">Duration:</span> {((new Date() - new Date(vehicleDetails.entryTime)) / (1000 * 60 * 60)).toFixed(2)} hours</p>
                  <p><span className="font-medium">Fees:</span> ${calculateFees()}</p>
                  <p><span className="font-medium">Payment Status:</span> {vehicleDetails.paymentStatus || 'unpaid'}</p>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Scan QR Code to Pay</h3>
                <QRCodeSVG 
                  value={`${window.location.origin}/payment/${plateNumber}`}
                  size={200}
                />
                <button onClick={() => navigate(`/payment/${plateNumber}`, { state: { fees: calculateFees() } })} className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg">Go to Payment Page</button>
              </div>
            </div>
          )}
          {paymentConfirmed && !showGate && (
            <div className="text-green-700 text-xl font-bold mt-8">Payment confirmed! Gate is opening...</div>
          )}
          {showGate && <OpeningGate />}
        </div>
      </div>
    </div>
  );
};

export default ExitDetection; 