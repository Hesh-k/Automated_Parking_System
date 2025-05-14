import React, { useEffect } from 'react';
import { useNumberPlateStore } from '../stores/numberPlateStore';
import { useParkingStore } from '../stores/parkingStore';
import Cookies from 'js-cookie';

function Dashboard() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const numberPlateVideoUrl = `${apiBaseUrl}/api/number_plate/video_feed`;
  const parkingVideoUrl = `${apiBaseUrl}/api/parking/video_feed`;
  const { plateData, setPlateData } = useNumberPlateStore();
  const { parkingData, setParkingData } = useParkingStore();
  const [error, setError] = React.useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Number plate data
        const plateResponse = await fetch(`${apiBaseUrl}/api/number_plate/data`);
        if (!plateResponse.ok) throw new Error('Failed to fetch number plate data');
        const plateData = await plateResponse.json();
        setPlateData(plateData);
        Cookies.set('number_plate_data', JSON.stringify({
          is_detected: !!plateData.number_plate,
          number_plate: plateData.number_plate || null,
          timestamp: plateData.timestamp || null
        }), { expires: 7 });

        // Parking data
        const freeResponse = await fetch(`${apiBaseUrl}/api/parking/free_spaces`);
        if (!freeResponse.ok) throw new Error('Failed to fetch free spaces');
        const freeData = await freeResponse.json();
        const occupiedResponse = await fetch(`${apiBaseUrl}/api/parking/occupied_spaces`);
        if (!occupiedResponse.ok) throw new Error('Failed to fetch occupied spaces');
        const occupiedData = await occupiedResponse.json();
        const parkingData = {
          free_spaces: freeData.free_spaces,
          occupied_spaces: occupiedData.occupied_spaces
        };
        setParkingData(parkingData);
        Cookies.set('parking_data', JSON.stringify({
          is_detected: true,
          free_spaces: parkingData.free_spaces,
          occupied_spaces: parkingData.occupied_spaces,
          timestamp: new Date().toISOString()
        }), { expires: 7 });

        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [apiBaseUrl, setPlateData, setParkingData]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Parking Management Dashboard
      </h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Number Plate Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Number Plate Detection</h2>
          <img
            src={numberPlateVideoUrl}
            alt="Number Plate Feed"
            className="w-full h-auto rounded-lg shadow-lg mb-4"
            onError={() => setError('Failed to load number plate video feed')}
          />
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <h3 className="text-xl font-semibold text-gray-700">Detected Plate</h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {plateData.number_plate || 'No Plate Detected'}
            </p>
            <h3 className="text-xl font-semibold text-gray-700 mt-4">Timestamp</h3>
            <p className="text-lg text-gray-600 mt-2">{plateData.timestamp || 'N/A'}</p>
          </div>
        </div>
        {/* Parking Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Parking Space Detection</h2>
          <img
            src={parkingVideoUrl}
            alt="Parking Space Feed"
            className="w-full h-auto rounded-lg shadow-lg mb-4"
            onError={() => setError('Failed to load parking video feed')}
          />
          <div className="flex flex-col gap-4">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
              <h3 className="text-xl font-semibold text-gray-700">Free Spaces</h3>
              <p className="text-4xl font-bold text-green-600 mt-2">{parkingData.free_spaces || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
              <h3 className="text-xl font-semibold text-gray-700">Occupied Spaces</h3>
              <p className="text-4xl font-bold text-red-600 mt-2">{parkingData.occupied_spaces || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;