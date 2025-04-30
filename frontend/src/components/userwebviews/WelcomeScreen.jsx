import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createVehicleEntry } from '../../services/vehicleService';
import { FaCar } from 'react-icons/fa';

const WelcomeScreen = () => {
    const navigate = useNavigate();
    const [numberPlate, setNumberPlate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Validate Sri Lankan vehicle number plate format
    const validateNumberPlate = (plate) => {
        const formats = {
            modern: /^[A-Z]{2,3}-[0-9]{4}$/,           // ABC-1234
            vintage: /^[0-9]{2}-[0-9]{4}$/,            // 19-8457
            special: /^[A-Z]{2}-[A-Z]{3}-[0-9]{4}$/    // WP-CAB-1234
        };

        const upperPlate = plate.toUpperCase();
        return formats.modern.test(upperPlate) || 
               formats.vintage.test(upperPlate) || 
               formats.special.test(upperPlate);
    };

    // Handle input changes with validation
    const handleInputChange = (e) => {
        const value = e.target.value.toUpperCase(); // Convert to uppercase as they type
        // Allow only alphanumeric characters and hyphen
        if (/^[A-Z0-9-]*$/.test(value) && value.length <= 11) {
            setNumberPlate(value);
            setError('');
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
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
            const initialData = {
                vehicleId: numberPlate,
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

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !loading && numberPlate.trim()) {
            handleSubmit(e);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="w-full max-w-md">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <FaCar className="text-5xl text-blue-500 mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Smart Parking
                        </h1>
                        <p className="text-gray-600">
                            Enter your vehicle number to continue
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <input
                                type="text"
                                value={numberPlate}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                placeholder="ABC-1234"
                                className={`w-full px-4 py-3 text-lg border ${
                                    numberPlate && (validateNumberPlate(numberPlate) 
                                        ? 'border-green-500 focus:ring-green-500' 
                                        : 'border-red-300 focus:ring-red-500')
                                } rounded-lg focus:outline-none focus:ring-2 transition-all`}
                                disabled={loading}
                            />
                            {numberPlate && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    {validateNumberPlate(numberPlate) ? (
                                        <span className="text-green-500 text-xl">✓</span>
                                    ) : (
                                        <span className="text-red-500 text-xl">×</span>
                                    )}
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                <p className="text-red-700">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !numberPlate.trim()}
                            className="w-full bg-blue-500 text-white py-3 rounded-lg text-lg font-semibold
                                     hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 
                                     disabled:bg-gray-400 disabled:cursor-not-allowed
                                     transition-all duration-200"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : 'Continue'}
                        </button>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="font-medium text-gray-700 mb-3">Valid number plate formats:</p>
                            <div className="grid gap-2 text-sm">
                                <div className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                                    <span className="font-medium text-gray-600">Standard:</span>
                                    <span className="text-gray-800">ABC-1234</span>
                                </div>
                                <div className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                                    <span className="font-medium text-gray-600">Special:</span>
                                    <span className="text-gray-800">WP-CAB-1234</span>
                                </div>
                                <div className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                                    <span className="font-medium text-gray-600">Vintage:</span>
                                    <span className="text-gray-800">19-8457</span>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen; 