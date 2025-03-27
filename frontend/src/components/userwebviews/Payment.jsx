import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateVehicleExit, processPayment } from '../../services/vehicleService';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [paymentDetails, setPaymentDetails] = useState({
        amount: 0,
        duration: 0,
        vehicleData: null
    });

    useEffect(() => {
        const calculateCharges = async () => {
            if (!location.state?.vehicleData) {
                navigate('/');
                return;
            }

            try {
                const exitData = await updateVehicleExit(location.state.vehicleData.vehicleId);
                setPaymentDetails({
                    amount: exitData.charge,
                    duration: exitData.duration,
                    vehicleData: location.state.vehicleData
                });
            } catch (err) {
                setError(err.message || 'Failed to calculate charges');
            }
        };

        calculateCharges();
    }, [location.state, navigate]);

    const handlePayment = async () => {
        setLoading(true);
        setError('');

        try {
            const paymentData = {
                vehicleId: paymentDetails.vehicleData.vehicleId,
                amount: paymentDetails.amount,
                paymentMethod: 'card' // or any other payment method
            };

            await processPayment(paymentDetails.vehicleData.vehicleId, paymentData);
            navigate('/payment-success', { 
                state: { 
                    vehicleData: paymentDetails.vehicleData,
                    paymentAmount: paymentDetails.amount 
                }
            });
        } catch (err) {
            setError(err.message || 'Payment failed');
        } finally {
            setLoading(false);
        }
    };

    if (!paymentDetails.vehicleData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Payment Details</h2>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            <div className="space-y-4">
                <div className="flex justify-between">
                    <span className="font-semibold">Vehicle Number:</span>
                    <span>{paymentDetails.vehicleData.vehicleId}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold">Duration:</span>
                    <span>{paymentDetails.duration.toFixed(2)} hours</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold">Amount to Pay:</span>
                    <span>Rs. {paymentDetails.amount.toFixed(2)}</span>
                </div>
                <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full mt-6 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {loading ? 'Processing...' : 'Pay Now'}
                </button>
            </div>
        </div>
    );
};

export default Payment; 