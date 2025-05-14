import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createVehicle } from '../services/vehicleService';

const Welcome = () => {
  const [plateNumber, setPlateNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Sri Lankan plate number validation (e.g., AA-4343 or ABD-5434)
  const validatePlateNumber = (plate) => {
    // Regex for Sri Lankan plates: 
    // - AA-4343 (2 letters, hyphen, 4 digits) or 
    // - ABD-5434 (3 letters, hyphen, 4 digits)
    const plateRegex = /^[A-Z]{2,3}-[0-9]{4}$/;
    return plateRegex.test(plate.trim().toUpperCase());
  };

  const handleStartSimulation = async () => {
    // Trim the input and convert to uppercase for consistency
    const trimmedPlateNumber = plateNumber.trim().toUpperCase();

    // Check if the plate number is empty
    if (!trimmedPlateNumber) {
      setError('Please enter a vehicle plate number');
      return;
    }

    // Validate the plate number format
    if (!validatePlateNumber(trimmedPlateNumber)) {
      setError('Please enter a valid Sri Lankan plate number (e.g., AA-4343 or ABD-5434)');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create initial vehicle record
      const vehicleData = {
        vehicleId: trimmedPlateNumber,
        vehicleType: 'Car', // Default type
        entryTime: new Date().toISOString(),
        status: 'pending',
      };

      const response = await createVehicle(vehicleData);

      // Navigate to vehicle details page with the vehicle ID
      navigate(`/vehicle-details/${response.id}`);
    } catch (error) {
      console.error('Error starting simulation:', error);
      setError(error.message || 'Failed to start vehicle detection simulation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Smart Parking System
        </h1>

        <div className="space-y-6">
          <div>
            <label htmlFor="plateNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Plate Number
            </label>
            <input
              type="text"
              id="plateNumber"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              placeholder="Enter plate number (e.g., AA-4343 or ABD-5434)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleStartSimulation}
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors duration-200`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Starting Simulation...
              </div>
            ) : (
              'Start Vehicle Detection Simulation'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;