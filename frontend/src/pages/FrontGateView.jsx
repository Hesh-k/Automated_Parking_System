import React, { useState, useEffect } from 'react';

function FrontGateView() {
  // Use environment variable or fallback to localhost for development
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

    fetchSpaces(); // Initial fetch
    const interval = setInterval(fetchSpaces, 1000); // Update every second
    return () => clearInterval(interval); // Cleanup
  }, [apiBaseUrl]); // Re-run if apiBaseUrl changes

  return (
    <div className="front-gate-view">
      <h1>Front Gate Parking View</h1>
      <div className="content">
        <div className="video-container">
          <img src={videoFeedUrl} alt="Parking Space Feed" />
        </div>
        <div className="stats">
          <p>Free Spaces: {freeSpaces}</p>
          <p>Occupied Spaces: {occupiedSpaces}</p>
        </div>
      </div>
    </div>
  );
}

export default FrontGateView;