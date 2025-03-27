import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const EntryConfirmed = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const vehicleData = location.state?.vehicleData;

    if (!vehicleData) {
        navigate('/');
        return null;
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg text-center">
            <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-6">Entry Confirmed!</h2>
            <div className="space-y-4">
                <div>
                    <p className="text-gray-600">Vehicle Number</p>
                    <p className="font-semibold">{vehicleData.vehicleId}</p>
                </div>
                <div>
                    <p className="text-gray-600">Entry Time</p>
                    <p className="font-semibold">{new Date(vehicleData.entryTime).toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-gray-600">Expected Duration</p>
                    <p className="font-semibold">{vehicleData.expectedDurationHours} hours</p>
                </div>
                <button
                    onClick={() => navigate('/qr-code', { state: { vehicleData } })}
                    className="w-full mt-6 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                    Generate QR Code
                </button>
            </div>
        </div>
    );
};

export default EntryConfirmed; 