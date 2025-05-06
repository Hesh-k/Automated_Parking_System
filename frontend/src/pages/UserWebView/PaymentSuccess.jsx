import React from 'react';

const PaymentSuccess = () => {
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
          Payment Successful!
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Your payment has been processed successfully. The exit gate will open automatically.
        </p>
        
        <div className="animate-pulse">
          <div className="h-2 w-48 bg-green-500 rounded-full mx-auto"></div>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          Thank you for using our parking service
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess; 