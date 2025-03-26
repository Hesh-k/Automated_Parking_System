import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  UserCog,
  BarChart3,
  CreditCard,
  ArrowLeft,
  Users,
  Settings,
  AlertCircle,
  ChevronDown,
  Minus,
  Plus,
  Edit,
  X
} from 'lucide-react';
import axios from "axios";

const AdminPanel = () => {
  
  const [parkingSlots, setParkingSlots] = useState([]);
  const [showAddSlotForm, setShowAddSlotForm] = useState(false);
  const [slotForm, setSlotForm] = useState({
    slotId: '',
    slotSection: '',
    slotRow: '',
    slotStatus: 'Available',
    slotType: 'standard',
    slotFeePerHour: 0
  });

  useEffect(() => {
    const getParkingSlots = async () => {
      try {
        const response = await axios.get("http://localhost:5000/get_slots");
        setParkingSlots(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getParkingSlots();
  }, [slotForm]);

  const parkingData = {
    totalSpots: 50,
    occupied: 32,
    revenue: 1250.75,
    activeUsers: 28
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/add_slot", slotForm);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }

    setShowAddSlotForm(false);
    setSlotForm({
      slotId: '',
      slotSection: '',
      slotRow: '',
      slotStatus: 'Available',
      slotType: 'standard',
      slotFeePerHour: 0
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <UserCog className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-semibold text-gray-900">Admin Panel</span>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600">
                  <Settings className="h-5 w-5" />
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              <Link
                to="/"
                className="flex items-center text-gray-600 hover:text-indigo-600"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-4 py-8 bg-gray-000">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">Total Spots</h3>
              <Car className="h-6 w-6 text-indigo-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {parkingSlots.length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Across All Sections</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">Available Spots</h3>
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {parkingSlots.filter((slot) => slot.slotStatus === "Available").length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Current Availability</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">Occupied Spots</h3>
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {parkingSlots.filter((slot) => slot.slotStatus === "Occupied").length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Current Occupancy</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">Revenue</h3>
              <CreditCard className="h-6 w-6 text-indigo-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              LKR {parkingData.revenue.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-1">Today's Earnings</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">Active Users</h3>
              <BarChart3 className="h-6 w-6 text-indigo-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-2">{parkingData.activeUsers}</p>
            <p className="text-sm text-gray-500 mt-1">Current sessions</p>
          </div>
        </div>

        {/* Parking Map */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Parking Map</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-400 rounded mr-2"></div>
                <span className="text-sm text-gray-900">Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-400 rounded mr-2"></div>
                <span className="text-sm text-gray-900">Occupied</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid lg:grid-cols-5 sm:grid-cols-4 gap-4">
              {parkingSlots.map((slot) => (
                <div
                  key={slot.slotId}
                  className={`h-28 rounded-lg flex items-center justify-center
                      ${slot.slotStatus === "Occupied" ? 'bg-red-300 text-red-900' : 'bg-green-300 text-green-800'}
                    `}
                >
                  <div className="text-center">
                    <div className="font-medium">{slot.slotId}</div>
                    <div className="font-medium">{`section-${slot.slotSection}-row-${slot.slotRow}`}</div>
                    <div className="text-sm mt-1">
                      {slot.slotStatus === "Occupied" ? (
                        <>
                          <div className="text-xs">Vehicle : {slot.carNumber}</div>
                          <div className="text-xs">Occupied : {slot.occupiedTime}</div>
                        </>
                      ) : (
                        <div className="text-sm text-gray-600">Available</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-200">Parking Slots</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddSlotForm(true)}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <Minus className="h-5 w-5 mr-2" />
                Remove Slot
              </button>
              <button
                onClick={() => setShowAddSlotForm(true)}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Slot
              </button>
            </div>
          </div>

          <div className="overflow-x-auto w-full max-w-none">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-400">
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6 text-center">
                    Slot ID
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6 text-center">
                    Slot Location
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6 text-center">
                    Slot Status
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6 text-center">
                    Slot Type
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6 text-center">
                    Fee/hr
                  </th>
                  <th className="sr-only">
                    Edit
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 w-full">
                {parkingSlots.map((slot) => (
                  <tr key={slot.slotId} className="w-full">
                    <td className="px-6 py-4 text-sm text-gray-900 text-center w-1/6">
                      {slot.slotId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-center w-1/6">
                      {`section-${slot.slotSection}-row-${slot.slotRow}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-center w-1/6">
                      {slot.slotStatus}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-center w-1/6">
                      {slot.slotType}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-center w-1/6">
                      {slot.slotFeePerHour}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-center w-1/6">
                      <button
                        onClick={() => setShowAddSlotForm(true)}
                        className="flex items-center px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:ring-offset-1"
                      >
                        <Edit className="h-5 w-5 mr-2" />
                        Edit slot details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">System Alerts</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">
                  Level 2 Capacity Warning
                </h3>
                <p className="mt-1 text-sm text-yellow-700">
                  Level 2 is currently at 90% capacity. Consider directing new vehicles to Level 1.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">
                  System Maintenance
                </h3>
                <p className="mt-1 text-sm text-blue-700">
                  Scheduled maintenance will occur tonight at 02:00. Some features may be temporarily unavailable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Slot Modal */}
      {showAddSlotForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Parking Slot</h3>
              <button
                onClick={() => setShowAddSlotForm(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slot ID
                </label>
                <input
                  type="text"
                  value={slotForm.slotId}
                  onChange={(e) => setSlotForm({ ...slotForm, slotId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter slot ID"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slot Section
                </label>
                <input
                  type="text"
                  value={slotForm.slotSection}
                  onChange={(e) => setSlotForm({ ...slotForm, slotSection: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter section (e.g., A, B, C)"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slot Row
                </label>
                <input
                  type="text"
                  value={slotForm.slotRow}
                  onChange={(e) => setSlotForm({ ...slotForm, slotRow: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter row number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slot Fee/Hour
                </label>
                <input
                  type="number"
                  min={0} max={10_000}
                  value={slotForm.slotFeePerHour}
                  onChange={(e) => setSlotForm({ ...slotForm, slotFeePerHour: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter slot number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slot Type
                </label>
                <select
                  value={slotForm.slotType}
                  onChange={(e) => setSlotForm({ ...slotForm, slotType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="car">Car</option>
                  <option value="bike">Bike</option>
                  <option value="van">Van</option>
                  <option value="lorry">Lorry</option>
                  <option value="three-wheel">Three Wheel</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddSlotForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Add Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;