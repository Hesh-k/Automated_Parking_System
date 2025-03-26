import React, { useState } from 'react';

const VehicleInfoForm = ({ vehicle }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    // Simulate sending to backend here
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-green-100">
        <h1 className="text-3xl font-bold text-green-800 mb-4">Access Granted</h1>
        <p className="text-lg text-green-700">The gate is now opening. Please proceed.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="bg-gray-100 p-6 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Enter Details</h1>
        <p className="mb-2"><strong>Plate:</strong> {vehicle.plate}</p>
        <p className="mb-4"><strong>Type:</strong> {vehicle.type}</p>
        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-2 mb-3 rounded border"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Mobile Number"
          className="w-full p-2 mb-4 rounded border"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Enter to the Park
        </button>
      </div>
    </div>
  );
};

export default VehicleInfoForm;
