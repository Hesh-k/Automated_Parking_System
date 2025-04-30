import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getVehicleDetails, generateVehicleQR } from '../../services/vehicleService';
import { FaQrcode, FaEdit } from 'react-icons/fa';

const InitialVehicleDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [vehicleData, setVehicleData] = useState(null);
    const [qrCode, setQrCode] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (!location.state?.vehicleId) {
                navigate('/');
                return;
            }

            try {
                // Get vehicle details
                const details = await getVehicleDetails(location.state.vehicleId);
                setVehicleData(details);

                // Generate QR code
                const qrResponse = await generateVehicleQR(location.state.vehicleId);
                setQrCode(qrResponse.qrCode);
            } catch (err) {
                setError(err.message || 'Failed to fetch vehicle information');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [location.state, navigate]);

    const handleUpdateDetails = () => {
        navigate('/vehicle-entry', { 
            state: { vehicleId: vehicleData.vehicleId }
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Vehicle Detected</h2>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                <div className="space-y-6">
                    <div className="text-center">
                        <p className="text-gray-600">Vehicle Number</p>
                        <p className="text-2xl font-bold">{vehicleData?.vehicleId}</p>
                    </div>
                    
                    {qrCode && (
                        <div className="flex flex-col items-center space-y-2">
                            <FaQrcode className="text-4xl text-gray-600" />
                            <img 
                                src={qrCode} 
                                alt="Vehicle QR Code" 
                                className="w-48 h-48 object-contain"
                            />
                            <p className="text-sm text-gray-500">
                                Please save this QR code for exit
                            </p>
                        </div>
                    )}

                    <div className="border-t pt-6">
                        <p className="text-center text-gray-600 mb-4">
                            Would you like to provide additional details?
                        </p>
                        <button
                            onClick={handleUpdateDetails}
                            className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 flex items-center justify-center space-x-2"
                        >
                            <FaEdit />
                            <span>Update Vehicle Details</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InitialVehicleDetails; 