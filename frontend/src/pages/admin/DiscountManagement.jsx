import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, AlertCircle } from 'lucide-react';
import { 
  getAllDiscounts, 
  createDiscount, 
  updateDiscount, 
  deleteDiscount 
} from '../../services/discountService';

const DiscountManagement = () => {
  const [discounts, setDiscounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Fetch discounts on component mount
  useEffect(() => {
    fetchDiscounts();
  }, []);

  // Show notification with auto dismiss
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Fetch all discounts from API
  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllDiscounts();
      setDiscounts(data);
      console.log('Discounts loaded successfully:', data);
    } catch (error) {
      console.error('Failed to fetch discounts:', error);
      setError('Failed to load discounts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit discount
  const handleEdit = (discount) => {
    setSelectedDiscount(discount);
    setIsModalOpen(true);
  };

  // Handle delete discount
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this discount?')) {
      try {
        await deleteDiscount(id);
        setDiscounts(discounts.filter(discount => discount.id !== id));
        showNotification('Discount deleted successfully');
        console.log(`Discount ${id} deleted successfully`);
      } catch (error) {
        console.error(`Error deleting discount ${id}:`, error);
        showNotification(`Failed to delete discount: ${error.message}`, 'error');
      }
    }
  };

  // Handle save (create or update) discount
  const handleSaveDiscount = async (formData) => {
    try {
      if (selectedDiscount) {
        // Update existing discount
        const response = await updateDiscount(selectedDiscount.id, formData);
        setDiscounts(discounts.map(d => 
          d.id === selectedDiscount.id ? response.data : d
        ));
        showNotification('Discount updated successfully');
        console.log(`Discount ${selectedDiscount.id} updated successfully:`, response);
      } else {
        // Create new discount
        const response = await createDiscount(formData);
        setDiscounts([...discounts, response.data]);
        showNotification('Discount created successfully');
        console.log('New discount created successfully:', response);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving discount:', error);
      showNotification(`Failed to save discount: ${error.message}`, 'error');
      // Keep modal open so user can try again
    }
  };

  // Filter discounts based on search term and status filter
  const filteredDiscounts = discounts.filter(discount => {
    const matchesSearch = discount.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discount.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || discount.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const exportCSV = () => {
    const headers = [
      'Name', 'Description', 'Amount', 'Type', 'Status', 'Start Date', 'End Date'
    ];
    const rows = filteredDiscounts.map(d => [
      d.name,
      d.description,
      d.amount,
      d.type,
      d.status,
      d.startDate ? new Date(d.startDate).toLocaleDateString() : '',
      d.endDate ? new Date(d.endDate).toLocaleDateString() : ''
    ]);
    const csvContent = [headers, ...rows].map(r => r.map(x => `"${(x ?? '').toString().replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `discounts_report_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Discount Management</h1>
            <p className="text-gray-600">Create and manage parking discounts</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportCSV}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow"
            >
              Export as CSV
            </button>
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
        </div>

        {/* Notification */}
        {notification.show && (
          <div className={`mb-4 p-3 rounded-lg flex items-center ${
            notification.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
            {notification.type === 'error' ? (
              <AlertCircle className="w-5 h-5 mr-2" />
            ) : (
              <div className="w-5 h-5 mr-2">✓</div>
            )}
            {notification.message}
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

        {/* Loading and Error States */}
        {loading && (
          <div className="text-center py-10">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Loading discounts...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredDiscounts.length === 0 && (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all' 
                ? 'No discounts match your search/filter criteria' 
                : 'No discounts found. Create your first discount!'}
            </p>
          </div>
        )}

        {/* Discounts Grid */}
        {!loading && !error && filteredDiscounts.length > 0 && (
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
                    <span className="font-medium">Reward:</span>
                    <span className="ml-2">
                      {discount.reward.type === 'percentage' 
                        ? `${discount.reward.value}% off`
                        : `$${discount.reward.value} off`
                      }
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Usage:</span>
                    <span className="ml-2">{discount.usageCount} times</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Created:</span>
                    <span className="ml-2">{new Date(discount.createdAt).toLocaleDateString()}</span>
                  </div>
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
        )}

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <DiscountFormModal
            discount={selectedDiscount}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveDiscount}
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await onSave(formData);
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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

          {/* Conditional form fields based on discount type */}
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

          {formData.type === 'timeframe' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Day Type
              </label>
              <select
                value={formData.condition?.dayType || 'weekend'}
                onChange={(e) => setFormData({
                  ...formData,
                  condition: { ...formData.condition, dayType: e.target.value }
                })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="weekend">Weekend</option>
                <option value="weekday">Weekday</option>
                <option value="holiday">Holiday</option>
              </select>
            </div>
          )}

          {formData.type === 'timing' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={formData.condition?.startTime || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    condition: { ...formData.condition, startTime: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={formData.condition?.endTime || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    condition: { ...formData.condition, endTime: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
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
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
            />
          </div>

          {discount && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status || 'active'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>{discount ? 'Update' : 'Create'} Discount</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DiscountManagement;