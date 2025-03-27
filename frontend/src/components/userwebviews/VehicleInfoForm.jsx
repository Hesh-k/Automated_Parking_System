import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createVehicleEntry, getVehicleDetails, updateVehicleDetails } from '../../services/vehicleService';

const VehicleInfoForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        vehicleId: '',
        vehicleType: 'Car',
        driverName: '',
        mobileNumber: '',
        email: '',
        purposeOfVisit: '',
        expectedDurationHours: 1
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isUpdate, setIsUpdate] = useState(false);

    useEffect(() => {
        const fetchVehicleDetails = async () => {
            if (location.state?.vehicleId) {
                setIsUpdate(true);
                try {
                    const details = await getVehicleDetails(location.state.vehicleId);
                    setFormData(prev => ({
                        ...prev,
                        ...details,
                        expectedDurationHours: details.expectedDurationHours || 1
                    }));
                } catch (err) {
                    setError('Failed to fetch vehicle details');
                }
            }
        };

        fetchVehicleDetails();
    }, [location.state]);

    const validateForm = () => {
        if (!formData.driverName) {
            setError('Driver name is required');
            return false;
        }
        if (!formData.mobileNumber) {
            setError('Mobile number is required');
            return false;
        }
        if (!formData.email) {
            setError('Email is required');
            return false;
        }
        // Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(formData.email)) {
            setError('Invalid email format');
            return false;
        }
        // Validate mobile number (Sri Lankan format)
        const mobilePattern = /^(?:\+94|0)[1-9][0-9]{8}$/;
        if (!mobilePattern.test(formData.mobileNumber)) {
            setError('Invalid mobile number format (use +94 or 0 prefix)');
            return false;
        }
        return true;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            const vehicleData = {
                ...formData,
                isDetailsUpdated: true,
                status: 'entered'
            };

            let response;
            if (isUpdate) {
                response = await updateVehicleDetails(formData.vehicleId, vehicleData);
            } else {
                vehicleData.entryTime = new Date().toISOString();
                response = await createVehicleEntry(vehicleData);
            }

            navigate('/entry-confirmed', { state: { vehicleData: response } });
        } catch (err) {
            setError(err.message || 'Failed to save vehicle details');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">
                {isUpdate ? 'Update Vehicle Details' : 'Vehicle Entry Form'}
            </h2>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700">Vehicle Number</label>
                    <input
                        type="text"
                        name="vehicleId"
                        value={formData.vehicleId}
                        disabled={isUpdate}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Vehicle Type</label>
                    <select
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    >
                        <option value="Car">Car</option>
                        <option value="Van">Van</option>
                        <option value="Motorcycle">Motorcycle</option>
                        <option value="Truck">Truck</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700">Driver Name</label>
                    <input
                        type="text"
                        name="driverName"
                        value={formData.driverName}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Mobile Number</label>
                    <input
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        placeholder="+94XXXXXXXXX"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Purpose of Visit</label>
                    <input
                        type="text"
                        name="purposeOfVisit"
                        value={formData.purposeOfVisit}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Expected Duration (hours)</label>
                    <input
                        type="number"
                        name="expectedDurationHours"
                        value={formData.expectedDurationHours}
                        onChange={handleChange}
                        min="1"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {loading ? 'Processing...' : (isUpdate ? 'Update Details' : 'Submit')}
                </button>
            </form>
        </div>
    );
};

export default VehicleInfoForm; 