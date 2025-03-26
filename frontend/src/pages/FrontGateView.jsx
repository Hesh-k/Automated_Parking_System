import React, { useState, useEffect } from 'react';

function FrontGateView() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const videoFeedUrl = `${apiBaseUrl}/api/video_feed`;
  const [freeSpaces, setFreeSpaces] = useState(0);
  const [occupiedSpaces, setOccupiedSpaces] = useState(0);

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const freeResponse = await fetch(`${apiBaseUrl}/api/free_spaces`);
        const freeData = await freeResponse.json();
        setFreeSpaces(freeData.free_spaces);

        const occupiedResponse = await fetch(`${apiBaseUrl}/api/occupied_spaces`);
        const occupiedData = await occupiedResponse.json();
        setOccupiedSpaces(occupiedData.occupied_spaces);
      } catch (error) {
        console.error('Error fetching space data:', error);
      }
    };

    fetchSpaces();
    const interval = setInterval(fetchSpaces, 1000);
    return () => clearInterval(interval);
  }, [apiBaseUrl]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Front Gate Parking View
      </h1>
      <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto">
        {/* Video Feed (Left) */}
        <div className="flex-1">
          <img
            src={videoFeedUrl}
            alt="Parking Space Feed"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        {/* Stats Boxes (Right) */}
        <div className="flex flex-col gap-4 w-full md:w-1/3">
          {/* Free Spaces Box */}
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <h2 className="text-xl font-semibold text-gray-700">Free Spaces</h2>
            <p className="text-4xl font-bold text-green-600 mt-2">{freeSpaces}</p>
          </div>
          {/* Occupied Spaces Box */}
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
            <h2 className="text-xl font-semibold text-gray-700">Occupied Spaces</h2>
            <p className="text-4xl font-bold text-red-600 mt-2">{occupiedSpaces}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FrontGateView;