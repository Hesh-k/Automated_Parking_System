import React, { useEffect } from 'react';
import { useNumberPlateStore } from '../stores/numberPlateStore';
import Cookies from 'js-cookie';

function NumberPlate() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const videoFeedUrl = `${apiBaseUrl}/api/number_plate/video_feed`;
  const { plateData, setPlateData } = useNumberPlateStore();

  useEffect(() => {
    const fetchPlateData = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/number_plate/data`);
        const data = await response.json();

        // Update Zustand store
        setPlateData(data);

        // Store in cookie
        Cookies.set('number_plate_data', JSON.stringify({
          is_detected: !!data.number_plate,
          number_plate: data.number_plate || null,
          timestamp: data.timestamp || null
        }), { expires: 7 }); // Cookie expires in 7 days
      } catch (error) {
        console.error('Error fetching number plate data:', error);
      }
    };

    fetchPlateData();
    const interval = setInterval(fetchPlateData, 1000);
    return () => clearInterval(interval);
  }, [apiBaseUrl, setPlateData]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Number Plate Detection
      </h1>
      <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto">
        {/* Video Feed (Left) */}
        <div className="flex-1">
          <img
            src={videoFeedUrl}
            alt="Number Plate Feed"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        {/* Number Plate Data (Right) */}
        <div className="flex flex-col gap-4 w-full md:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <h2 className="text-xl font-semibold text-gray-700">Detected Plate</h2>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {plateData.number_plate || 'No Plate Detected'}
            </p>
            <h2 className="text-xl font-semibold text-gray-700 mt-4">Timestamp</h2>
            <p className="text-lg text-gray-600 mt-2">
              {plateData.timestamp || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NumberPlate;