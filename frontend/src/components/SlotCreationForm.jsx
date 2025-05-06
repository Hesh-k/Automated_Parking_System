import { X } from "lucide-react";
import useParkingSlotStore from "../stores/ParkingSlotStore";

const SlotCreationForm = ({ showForm, setShowForm }) => {
  const {
    slotId,
    slotSection,
    slotRow,
    slotType,
    slotFeePerHour,
    setParkingSlotId,
    setParkingSlotSection,
    setParkingSlotRow,
    setParkingSlotType,
    setParkingSlotFeePerHour,
    createParkingSlot,
    isLoading,
    error,
    success
  } = useParkingSlotStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createParkingSlot();
    setShowForm(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Add New Parking Slot</h3>
          <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slot ID</label>
            <input
              type="text"
              value={slotId}
              onChange={(e) => setParkingSlotId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slot Section</label>
            <input
              type="text"
              value={slotSection}
              onChange={(e) => setParkingSlotSection(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slot Row</label>
            <input
              type="text"
              value={slotRow}
              onChange={(e) => setParkingSlotRow(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slot Fee/Hour</label>
            <input
              type="number"
              value={slotFeePerHour}
              onChange={(e) => setParkingSlotFeePerHour(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slot Type</label>
            <select
              value={slotType}
              onChange={(e) => setParkingSlotType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Add Slot"}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
        </form>
      </div>
    </div>
  );
};

export default SlotCreationForm;
