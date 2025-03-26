import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';

const Payment = () => {
  const { vehicleId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    try {
      const data = JSON.parse(decodeURIComponent(searchParams.get('data')));
      setPaymentData(data);
    } catch (error) {
      console.error('Error parsing payment data:', error);
    }
  }, [searchParams]);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Here you would integrate with your payment gateway
      // For demo, we'll simulate a payment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // After successful payment
      navigate('/payment-success');
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading payment details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Parking Payment
          </h2>

          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Vehicle ID:</span>
                <span className="font-medium">{vehicleId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{paymentData.duration} hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Entry Time:</span>
                <span className="font-medium">{new Date(paymentData.entryTime).toLocaleString()}</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount:</span>
                  <span>${paymentData.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold 
              ${isProcessing 
                ? 'opacity-75 cursor-not-allowed' 
                : 'hover:bg-blue-700 transform hover:scale-105'} 
              transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Pay Now'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment; 