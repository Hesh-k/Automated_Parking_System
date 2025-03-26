import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { vehicleData, paymentAmount } = location.state || {};

    if (!vehicleData) {
        navigate('/');
        return null;
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg text-center">
            <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-6">Payment Successful!</h2>
            <div className="space-y-4">
                <div>
                    <p className="text-gray-600">Amount Paid</p>
                    <p className="text-2xl font-bold">Rs. {paymentAmount.toFixed(2)}</p>
                </div>
                <div className="border-t pt-4">
                    <p className="text-gray-600">Vehicle Number</p>
                    <p className="font-semibold">{vehicleData.vehicleId}</p>
                </div>
                <div>
                    <p className="text-gray-600">Exit Time</p>
                    <p className="font-semibold">{new Date().toLocaleString()}</p>
                </div>
                <button
                    onClick={() => navigate('/')}
                    className="w-full mt-6 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccess; 