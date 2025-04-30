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
import ParkingMap from "../../components/ParkingMap";
import SlotCreationForm from '../../components/SlotCreationForm';
import axios from "axios";
import SettingsDropdown from '../../components/admin/SettingsDropdown';

// Dummy parking slot data
const dummyParkingSlots = [
  {
    slotId: "A101",
    slotSection: "A",
    slotRow: "1",
    slotStatus: "Available",
    slotType: "car",
    slotFeePerHour: 100
  },
  {
    slotId: "A102",
    slotSection: "A",
    slotRow: "1",
    slotStatus: "Occupied",
    slotType: "car",
    slotFeePerHour: 100,
    carNumber: "ABC-1234",
    occupiedTime: "2:30 PM"
  },
  {
    slotId: "B201",
    slotSection: "B",
    slotRow: "2",
    slotStatus: "Available",
    slotType: "van",
    slotFeePerHour: 150
  },
  {
    slotId: "B202",
    slotSection: "B",
    slotRow: "2",
    slotStatus: "Occupied",
    slotType: "van",
    slotFeePerHour: 150,
    carNumber: "XYZ-5678",
    occupiedTime: "3:15 PM"
  },
  {
    slotId: "C301",
    slotSection: "C",
    slotRow: "3",
    slotStatus: "Available",
    slotType: "bike",
    slotFeePerHour: 50
  }
];

const AdminPanel = () => {

  const [parkingSlots, setParkingSlots] = useState([]);
  const [showAddSlotForm, setShowAddSlotForm] = useState(false);

  useEffect(() => {
    const getParkingSlots = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/get_slots");
        setParkingSlots(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback to dummy data if API fails
        setParkingSlots(dummyParkingSlots);
      }
    };

    getParkingSlots();
  }, [showAddSlotForm]);

  const parkingData = {
    totalSpots: 50,
    occupied: 32,
    revenue: 1250.75,
    activeUsers: 28
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <SettingsDropdown />
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
        <ParkingMap parkingSlots={parkingSlots} />

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
      </main>

      {/* Add Slot Modal */}
      {showAddSlotForm && <SlotCreationForm showForm={showAddSlotForm} setShowForm={setShowAddSlotForm} />}
    </div>
  );
};

export default AdminPanel;