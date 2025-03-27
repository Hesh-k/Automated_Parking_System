import { useState } from "react";
import { X } from "lucide-react";

const SlotCreationForm = ({ showForm, setShowForm }) => {

  const [slotForm, setSlotForm] = useState({
    slotId: '',
    slotSection: '',
    slotRow: '',
    slotStatus: 'Available',
    slotType: 'standard',
    slotFeePerHour: 0
  });

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
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Add New Parking Slot</h3>
            <button
              onClick={() => setShowForm(false)}
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
                onClick={() => setShowForm(false)}
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
    </>
  );
};

export default SlotCreationForm;