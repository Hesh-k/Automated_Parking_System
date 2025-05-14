import React from 'react';

const OpeningGate = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
    <div className="relative w-64 h-40 flex items-center justify-center mb-8">
      {/* Gate Left */}
      <div className="absolute left-0 top-0 h-32 w-16 bg-gray-700 rounded-l-3xl shadow-lg animate-gate-left" style={{animationDuration: '2s'}} />
      {/* Gate Right */}
      <div className="absolute right-0 top-0 h-32 w-16 bg-gray-700 rounded-r-3xl shadow-lg animate-gate-right" style={{animationDuration: '2s'}} />
      {/* Car */}
      <div className="absolute left-1/2 top-24 transform -translate-x-1/2">
        <svg width="80" height="40" viewBox="0 0 80 40">
          <rect x="10" y="10" width="60" height="20" rx="10" fill="#2563eb" />
          <circle cx="22" cy="32" r="8" fill="#1e293b" />
          <circle cx="58" cy="32" r="8" fill="#1e293b" />
        </svg>
      </div>
    </div>
    <h2 className="text-2xl font-bold text-blue-900 mb-2 animate-fade-in">Opening the gate...</h2>
    <p className="text-lg text-blue-800 animate-fade-in">Now you can enter the park</p>
  </div>
);

export default OpeningGate;

// Tailwind CSS animations (add to your global CSS if not already present):
// .animate-gate-left { animation: gateLeftOpen 2s forwards; }
// .animate-gate-right { animation: gateRightOpen 2s forwards; }
// @keyframes gateLeftOpen { 0% { left: 0; } 100% { left: -60px; } }
// @keyframes gateRightOpen { 0% { right: 0; } 100% { right: -60px; } }
// .animate-fade-in { animation: fadeIn 1s ease-in; }
// @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } 