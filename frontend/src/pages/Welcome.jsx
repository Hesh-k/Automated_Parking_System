import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createVehicle, checkActiveVehicle } from '../services/vehicleService';

const Loader = () => (
  <div className="flex flex-col items-center justify-center mt-8">
    <div className="relative w-20 h-10 mb-4">
      <div className="absolute left-0 top-4 w-20 h-2 bg-gray-300 rounded-full animate-pulse" />
      <div className="absolute left-1/2 top-0 transform -translate-x-1/2">
        <svg width="60" height="30" viewBox="0 0 60 30">
          <rect x="10" y="10" width="40" height="15" rx="7" fill="#2563eb" />
          <circle cx="18" cy="27" r="5" fill="#1e293b" />
          <circle cx="42" cy="27" r="5" fill="#1e293b" />
        </svg>
      </div>
    </div>
    <span className="text-blue-700 font-medium animate-pulse">Detecting vehicle, please wait...</span>
  </div>
);

const Welcome = () => {
  const [loading, setLoading] = useState(true);
  const [vehicleData, setVehicleData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [resetLoader, setResetLoader] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Function to check for the number_plate_data cookie
    const checkCookie = async () => {
      const cookieString = document.cookie
        .split('; ')
        .find((row) => row.startsWith('number_plate_data='));
      if (cookieString) {
        try {
          const value = decodeURIComponent(cookieString.split('=')[1]);
          const data = JSON.parse(value);
          setVehicleData(data);
          setLoading(false);

          // Check if vehicle is already inside
          const isActive = await checkActiveVehicle(data.number_plate);
          if (isActive) {
            setError('This vehicle is already inside the park.');
            setTimeout(() => {
              // Delete the number_plate_data cookie
              document.cookie = "number_plate_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              setError(null);
              setResetLoader(true);
              setTimeout(() => {
                setResetLoader(false);
                setLoading(true);
                checkCookie();
              }, 100); // Briefly reset loader for smooth transition
            }, 3000);
            return;
          }

          // Send to backend
          const vehiclePayload = {
            vehicleId: data.number_plate,
            vehicleType: 'Car', // Default type, can be updated later
            entryTime: data.timestamp,
            status: 'pending',
          };
          const response = await createVehicle(vehiclePayload);
          setSuccess(true);
          setTimeout(() => {
            navigate(`/vehicle-details/${response.id}`);
          }, 1500);
        } catch (err) {
          setError('This vehicle is already inside the park');
          setLoading(false);
          document.cookie = "number_plate_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        navigate('/');
        }
      } else {
        setTimeout(checkCookie, 1000); // Retry every second
      }
    };
    checkCookie();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Smart Parking System
        </h1>
        {((loading && !resetLoader) || resetLoader) && <Loader />}
        {error && (
          <div className="bg-red-50 text-red-800 p-3 rounded-lg text-sm mt-4">
            {error}
          </div>
        )}
        {success && vehicleData && (
          <div className="flex flex-col items-center mt-6 animate-fade-in">
            <div className="text-green-600 text-2xl font-semibold mb-2">Vehicle Detected!</div>
            <div className="text-gray-700">Plate Number: <b>{vehicleData.number_plate}</b></div>
            <div className="text-gray-700">Entry Time: <b>{vehicleData.timestamp}</b></div>
            <div className="w-12 h-12 mt-4">
              <svg className="animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Welcome;