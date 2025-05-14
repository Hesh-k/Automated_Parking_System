import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createVehicle, checkActiveVehicle, getFirebaseDataFromCookie, deleteFirebaseDataCookie } from '../services/vehicleService';

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
  const [occupied, setOccupied] = useState(0);
  const [free, setFree] = useState(0);
  const navigate = useNavigate();
  const lastCookieRef = useRef('');

  useEffect(() => {
    let isMounted = true;
    const pollCookie = async () => {
      const cookie = document.cookie.match(/(?:^|; )firebase_data=([^;]*)/);
      const cookieValue = cookie ? cookie[1] : '';
      if (cookieValue !== lastCookieRef.current) {
        lastCookieRef.current = cookieValue;
        const data = getFirebaseDataFromCookie();
        if (data && data.parking_system) {
          const np = data.parking_system.number_plate;
          setOccupied(data.parking_system.parking?.occupied_spaces || 0);
          setFree(data.parking_system.parking?.free_spaces || 0);

          if (np && typeof np === 'object' && np.is_detected !== undefined) {
            const plate = np.number_plate;
            const ts = np.timestamp || data.parking_system.last_updated;

            if (np.is_detected && plate) {
              setVehicleData({
                number_plate: plate,
                timestamp: ts
              });
              setLoading(false);

              // Check if vehicle is already inside
              const isActive = await checkActiveVehicle(plate);
              if (isActive) {
                setError('This vehicle is already inside the park.');
                setTimeout(() => {
                  deleteFirebaseDataCookie();
                  setError(null);
                  setResetLoader(true);
                  setTimeout(() => {
                    setResetLoader(false);
                    setLoading(true);
                  }, 100);
                }, 3000);
                return;
              }

              // Send to backend
              const vehiclePayload = {
                vehicleId: plate,
                vehicleType: 'Car',
                entryTime: ts,
                status: 'pending',
              };
              const response = await createVehicle(vehiclePayload);
              setSuccess(true);
              setTimeout(() => {
                navigate(`/vehicle-details/${response.id}`);
              }, 1500);
            } else {
              setVehicleData(null);
              setLoading(false);
              setTimeout(() => {
                deleteFirebaseDataCookie();
                setVehicleData(null);
                setLoading(true);
              }, 2000);
            }
          }
        }
      }
    };

    const interval = setInterval(() => {
      if (isMounted) pollCookie();
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Smart Parking System
        </h1>
        <div className="mb-4 flex flex-row gap-8">
          <div className="text-gray-700">Occupied Spaces: <b>{occupied}</b></div>
          <div className="text-gray-700">Free Spaces: <b>{free}</b></div>
        </div>
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