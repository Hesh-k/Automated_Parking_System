import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { getVehicleDetails, updateVehicleDetails, deleteVehicle } from '../services/vehicleService';
import OpeningGate from '../components/OpeningGate';

const VehicleDetails = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    driverName: '',
    mobileNumber: '',
    email: '',
    purposeOfVisit: '',
    expectedDurationHours: '',
    vehicleType: 'Car'
  });
  const [showOpeningGate, setShowOpeningGate] = useState(false);

  useEffect(() => {
    fetchVehicleDetails();
  }, [vehicleId]);

  const fetchVehicleDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getVehicleDetails(vehicleId);
      setVehicle(data);
      setFormData({
        driverName: data.driverName || '',
        mobileNumber: data.mobileNumber || '',
        email: data.email || '',
        purposeOfVisit: data.purposeOfVisit || '',
        expectedDurationHours: data.expectedDurationHours || '',
        vehicleType: data.vehicleType || 'Car'
      });
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
      setError(error.message || 'Failed to fetch vehicle details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Delete the number_plate_data cookie
    document.cookie = "number_plate_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    try {
      setLoading(true);
      setError(null);
      await updateVehicleDetails(vehicleId, formData);
      setShowOpeningGate(true);
      setLoading(false);
      setTimeout(() => {
        navigate('/');
      }, 6000);
    } catch (error) {
      console.error('Error updating vehicle details:', error);
      setError(error.message || 'Failed to update vehicle details');
      setLoading(false);
    }
  };

  const handleDenyEntry = async () => {
    if (window.confirm('Are you sure you want to deny entry? This will delete the vehicle record.')) {
      try {
        setLoading(true);
        setError(null);
        await deleteVehicle(vehicleId);
        // Delete the number_plate_data cookie
        document.cookie = "number_plate_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        navigate('/'); // Navigate back to welcome screen
      } catch (error) {
        console.error('Error denying entry:', error);
        setError(error.message || 'Failed to deny entry');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (showOpeningGate) {
    return <OpeningGate />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vehicle Details</h1>
              <p className="text-gray-600">Plate Number: {vehicleId}</p>
            </div>
            <div className="text-center">
              <QRCodeSVG
                value={`${window.location.origin}/vehicle-details/${vehicleId}`}
                size={128}
                level="H"
                includeMargin={true}
              />
              <p className="text-sm text-gray-600 mt-2">Scan to view details</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Type
                </label>
                <select
                  id="vehicleType"
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Car">Car</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Van">Van</option>
                  <option value="Truck">Truck</option>
                </select>
              </div>

              <div>
                <label htmlFor="driverName" className="block text-sm font-medium text-gray-700 mb-2">
                  Driver Name
                </label>
                <input
                  type="text"
                  id="driverName"
                  name="driverName"
                  value={formData.driverName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="purposeOfVisit" className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose of Visit
                </label>
                <input
                  type="text"
                  id="purposeOfVisit"
                  name="purposeOfVisit"
                  value={formData.purposeOfVisit}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="expectedDurationHours" className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Duration (hours)
                </label>
                <input
                  type="number"
                  id="expectedDurationHours"
                  name="expectedDurationHours"
                  value={formData.expectedDurationHours}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={handleDenyEntry}
                className="px-6 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
              >
                Deny Entry
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Updating...' : 'Enter Park'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails; 