import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateVehicleQR } from '../../services/vehicleService';

const QRCodeVehicleEntry = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [qrCode, setQrCode] = useState('');
    const [error, setError] = useState('');
    const vehicleData = location.state?.vehicleData;

    useEffect(() => {
        const getQRCode = async () => {
            if (!vehicleData) {
                navigate('/');
                return;
            }

            try {
                const response = await generateVehicleQR(vehicleData.vehicleId);
                setQrCode(response.qrCode);
            } catch (err) {
                setError('Failed to generate QR code');
            }
        };

        getQRCode();
    }, [vehicleData, navigate]);

    if (!vehicleData) {
        return null;
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-6">Vehicle Entry QR Code</h2>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            {qrCode && (
                <div className="mb-6">
                    <img src={qrCode} alt="Vehicle QR Code" className="mx-auto" />
                </div>
            )}
            <div className="space-y-4">
                <div>
                    <p className="text-gray-600">Vehicle Number</p>
                    <p className="font-semibold">{vehicleData.vehicleId}</p>
                </div>
                <div>
                    <p className="text-gray-600">Entry Time</p>
                    <p className="font-semibold">{new Date(vehicleData.entryTime).toLocaleString()}</p>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                    Please save this QR code. You'll need it when exiting the parking lot.
                </p>
                <button
                    onClick={() => navigate('/vehicle-details', { state: { vehicleData } })}
                    className="w-full mt-6 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                    View Details
                </button>
            </div>
        </div>
    );
};

export default QRCodeVehicleEntry; 