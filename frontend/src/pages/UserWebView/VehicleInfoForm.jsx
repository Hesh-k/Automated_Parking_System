import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const VehicleInfoForm = ({ vehicle }) => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    // Backend POST logic here
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-green-100">
        <h1 className="text-3xl font-bold text-green-800 mb-4">Access Granted</h1>
        <p className="text-lg text-green-700">Gate is now opening for vehicle ID: {id}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Enter Your Details</h1>
        <p className="mb-2 text-gray-700"><strong>Plate:</strong> {vehicle.plate}</p>
        <p className="mb-4 text-gray-700"><strong>Type:</strong> {vehicle.type}</p>
        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-2 mb-3 rounded border border-gray-300"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Mobile Number"
          className="w-full p-2 mb-4 rounded border border-gray-300"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
        >
          Enter to the Park
        </button>
      </div>
    </div>
  );
};

export default VehicleInfoForm;