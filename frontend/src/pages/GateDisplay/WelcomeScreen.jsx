import React from 'react';

const WelcomeScreen = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-blue-50">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Smart Parking</h1>
      <p className="text-lg text-gray-600">Please drive forward for automatic detection</p>
    </div>
  );
};

export default WelcomeScreen;