import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GateOpen = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/exit', { replace: true });
      window.location.reload();
    }, 6000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Thank you, come again!</h2>
        <p className="mb-6 text-lg">You can now exit.<br />Opening the gate...</p>
        <div className="w-24 h-24 border-8 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500">Redirecting to exit page...</p>
      </div>
    </div>
  );
};

export default GateOpen; 