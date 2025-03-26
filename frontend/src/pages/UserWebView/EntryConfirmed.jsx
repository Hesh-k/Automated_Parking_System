import React from 'react';

const EntryConfirmed = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-md w-full text-center">
        <div className="mb-8">
          <svg
            className="w-20 h-20 text-green-500 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Entry Confirmed!
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Your vehicle has been registered successfully. The gate will open automatically.
        </p>
        
        <div className="animate-pulse">
          <div className="h-2 w-48 bg-green-500 rounded-full mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default EntryConfirmed; 