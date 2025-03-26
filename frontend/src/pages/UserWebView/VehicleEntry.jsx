import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const VehicleEntry = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    driverName: '',
    mobileNumber: '',
    email: '',
    purpose: '',
    duration: '1',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would typically make an API call to your backend
      // await axios.post('/api/vehicle-entry', { ...formData, vehicleId });
      
      // For now, we'll simulate success
      setTimeout(() => {
        navigate('/entry-confirmed');
      }, 1500);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg">
        <div className="py-8 px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Vehicle Entry Registration
          </h2>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              Vehicle ID: <span className="font-semibold">{vehicleId}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="driverName" className="block text-sm font-medium text-gray-700">
                Driver Name
              </label>
              <input
                type="text"
                name="driverName"
                id="driverName"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.driverName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <input
                type="tel"
                name="mobileNumber"
                id="mobileNumber"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.mobileNumber}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email (optional)
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
                Purpose of Visit
              </label>
              <select
                name="purpose"
                id="purpose"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.purpose}
                onChange={handleChange}
              >
                <option value="">Select purpose</option>
                <option value="shopping">Shopping</option>
                <option value="business">Business</option>
                <option value="visitor">Visitor</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                Expected Duration (hours)
              </label>
              <select
                name="duration"
                id="duration"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.duration}
                onChange={handleChange}
              >
                <option value="1">1 hour</option>
                <option value="2">2 hours</option>
                <option value="4">4 hours</option>
                <option value="8">8 hours</option>
                <option value="24">24 hours</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Processing...' : 'Confirm Entry'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VehicleEntry; 