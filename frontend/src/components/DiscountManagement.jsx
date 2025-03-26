import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const DiscountManagement = () => {
  const [discounts, setDiscounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Component mounted, fetching discounts...');
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      console.log('Fetching discounts from:', `${API_URL}/discounts`);
      const response = await axios.get(`${API_URL}/discounts`);
      console.log('Fetched discounts:', response.data);
      setDiscounts(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching discounts:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError('Failed to fetch discounts');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (discount) => {
    try {
      console.log('Fetching discount details for ID:', discount.id);
      const response = await axios.get(`${API_URL}/discounts/${discount.id}`);
      console.log('Fetched discount details:', response.data);
      setSelectedDiscount(response.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error('Error fetching discount details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError('Failed to fetch discount details');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this discount?')) {
      try {
        console.log('Deleting discount with ID:', id);
        const response = await axios.delete(`${API_URL}/discounts/${id}`);
        console.log('Delete response:', response.data);
        await fetchDiscounts();
      } catch (err) {
        console.error('Error deleting discount:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        setError('Failed to delete discount');
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      let response;
      if (selectedDiscount) {
        console.log('Updating discount with ID:', selectedDiscount.id);
        console.log('Update data:', formData);
        response = await axios.put(`${API_URL}/discounts/${selectedDiscount.id}`, formData);
        console.log('Update response:', response.data);
      } else {
        console.log('Creating new discount with data:', formData);
        response = await axios.post(`${API_URL}/discounts`, formData);
        console.log('Create response:', response.data);
      }
      await fetchDiscounts();
      setIsModalOpen(false);
      setSelectedDiscount(null);
    } catch (err) {
      console.error('Error saving discount:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        formData: formData
      });
      setError('Failed to save discount');
    }
  };

  // Log filtered results
  useEffect(() => {
    console.log('Filtered discounts:', filteredDiscounts);
  }, [searchTerm, filterStatus, discounts]);

  const filteredDiscounts = discounts.filter(discount => {
    const matchesSearch = discount.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discount.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || discount.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    console.log('Loading state active...');
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Discount Management</h1>
            <p className="text-gray-600">Create and manage parking discounts</p>
          </div>
          <button
            onClick={() => {
              setSelectedDiscount(null);
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Discount
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search discounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Discounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDiscounts.map(discount => (
            <div
              key={discount.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{discount.name}</h3>
                  <p className="text-sm text-gray-500">{discount.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  discount.status === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {discount.status}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Type:</span>
                  <span className="ml-2 capitalize">{discount.type}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Condition:</span>
                  <span className="ml-2">
                    {discount.condition?.days ? `${discount.condition.days} days` : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Reward:</span>
                  <span className="ml-2">
                    {discount.reward?.type === 'percentage' 
                      ? `${discount.reward.value}% off`
                      : `$${discount.reward.value} off`
                    }
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Usage:</span>
                  <span className="ml-2">{discount.usageCount || 0} times</span>
                </div>
                {discount.createdAt && (
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Created:</span>
                    <span className="ml-2">{new Date(discount.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleEdit(discount)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(discount.id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <DiscountFormModal
            discount={selectedDiscount}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
};

// Discount Form Modal Component
const DiscountFormModal = ({ discount, onClose, onSave }) => {
  const [formData, setFormData] = useState(discount || {
    name: '',
    type: 'frequency',
    condition: { days: '', visits: '' },
    reward: { type: 'percentage', value: '' },
    description: '',
    status: 'active'
  });

  // Log initial form data
  useEffect(() => {
    console.log('Form initialized with data:', formData);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting form with data:', formData);
    onSave(formData);
  };

  // Log form data changes
  useEffect(() => {
    console.log('Form data updated:', formData);
  }, [formData]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {discount ? 'Edit Discount' : 'Create New Discount'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="frequency">Frequency Based</option>
              <option value="timeframe">Timeframe Based</option>
              <option value="timing">Timing Based</option>
            </select>
          </div>

          {formData.type === 'frequency' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Required Days
              </label>
              <input
                type="number"
                min="1"
                value={formData.condition?.days || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  condition: { ...formData.condition, days: e.target.value }
                })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reward Type
              </label>
              <select
                value={formData.reward?.type || 'percentage'}
                onChange={(e) => setFormData({
                  ...formData,
                  reward: { ...formData.reward, type: e.target.value }
                })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value
              </label>
              <input
                type="number"
                min="0"
                max={formData.reward?.type === 'percentage' ? "100" : "999"}
                required
                value={formData.reward?.value || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  reward: { ...formData.reward, value: e.target.value }
                })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              {discount ? 'Update' : 'Create'} Discount
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DiscountManagement; 