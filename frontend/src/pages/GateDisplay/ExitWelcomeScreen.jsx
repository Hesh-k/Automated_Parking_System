import React from 'react';
import { Link } from 'react-router-dom';

const ExitWelcomeScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-2xl w-full text-center transform hover:scale-105 transition-transform duration-300">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          Exit Gate
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Drive closer to start vehicle detection
        </p>
        
        {/* Simulation button for development */}
        <Link 
          to="/exit/abc123" 
          className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transform hover:scale-105 transition-all duration-200"
        >
          Simulate Vehicle Detection
        </Link>
      </div>
    </div>
  );
};

export default ExitWelcomeScreen; 