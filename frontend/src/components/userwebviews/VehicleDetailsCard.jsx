import React from 'react';
import { useNavigate } from 'react-router-dom';

const VehicleDetailsCard = ({ vehicle }) => {
    const navigate = useNavigate();

    const handlePayment = () => {
        navigate('/payment', { state: { vehicleData: vehicle } });
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Vehicle Details</h2>
            <div className="space-y-4">
                <div className="flex justify-between">
                    <span className="font-semibold">Vehicle Number:</span>
                    <span>{vehicle.vehicleId}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold">Vehicle Type:</span>
                    <span>{vehicle.vehicleType}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold">Entry Time:</span>
                    <span>{new Date(vehicle.entryTime).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold">Driver Name:</span>
                    <span>{vehicle.driverName}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold">Mobile Number:</span>
                    <span>{vehicle.mobileNumber}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold">Email:</span>
                    <span>{vehicle.email}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold">Purpose of Visit:</span>
                    <span>{vehicle.purposeOfVisit}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold">Expected Duration:</span>
                    <span>{vehicle.expectedDurationHours} hours</span>
                </div>
                {vehicle.status === 'entered' && (
                    <button
                        onClick={handlePayment}
                        className="w-full mt-6 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                    >
                        Proceed to Payment
                    </button>
                )}
            </div>
        </div>
    );
};

export default VehicleDetailsCard; 