import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createVehicleEntry } from '../../services/vehicleService';

const Welcome = () => {
    const navigate = useNavigate();
    const [numberPlate, setNumberPlate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const validateNumberPlate = (plate) => {
        const pattern = /^([A-Z]{2,3}-[0-9]{4}|[A-Z]{2}-[A-Z]{3}-[0-9]{4}|[0-9]{2}-[0-9]{4})$/;
        return pattern.test(plate.toUpperCase());
    };

    const handleSubmit = async () => {
        if (!numberPlate.trim()) {
            setError('Please enter a vehicle number plate');
            return;
        }

        if (!validateNumberPlate(numberPlate)) {
            setError('Invalid number plate format. Use: ABC-1234, WP-CAB-1234, or 19-8457');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const upperPlate = numberPlate.toUpperCase();
            const initialData = {
                vehicleId: upperPlate,
                entryTime: new Date().toISOString(),
                status: 'pending',
                isDetailsUpdated: false
            };

            const response = await createVehicleEntry(initialData);

            navigate('/initial-vehicle-details', {
                state: { vehicleId: response.vehicleId }
            });
        } catch (err) {
            setError(err.message || 'Failed to process vehicle number');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-white">
            <div className="w-full max-w-md border border-gray-300 p-6 rounded-md shadow-sm bg-white">
                <h1 className="text-2xl font-bold text-center mb-4">Smart Parking</h1>
                <p className="text-center text-gray-700 mb-6">Enter your vehicle number</p>

                <input
                    type="text"
                    value={numberPlate}
                    onChange={(e) => setNumberPlate(e.target.value)}
                    placeholder="ABC-1234"
                    className="w-full p-3 border border-gray-300 rounded mb-4"
                    disabled={loading}
                />

                <button
                    onClick={handleSubmit}
                    disabled={loading || !numberPlate.trim()}
                    className="w-full bg-blue-500 text-white py-3 rounded disabled:bg-gray-400"
                >
                    {loading ? 'Processing...' : 'Simulate Vehicle Detection'}
                </button>

                {error && (
                    <p className="text-red-600 mt-4 text-center">{error}</p>
                )}

                <div className="mt-6 text-sm text-center text-gray-600">
                    <p className="font-medium">Valid formats:</p>
                    <p>ABC-1234, WP-CAB-1234, 19-8457</p>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
