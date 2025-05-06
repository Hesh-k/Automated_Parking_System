import { create } from "zustand";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/parking_slots";

const useParkingSlotStore = create((set) => ({
  slotId: "",
  slotSection: "",
  slotRow: "",
  slotType: "",
  slotFeePerHour: 0,
  slotStatus: "Available",

  parkingSlots: [],
  singleParkingSlot: null,
  isLoading: false,
  error: null,
  success: null,

  // Setters for form fields
  setParkingSlotId: (slotId) => set({ slotId }),
  setParkingSlotSection: (slotSection) => set({ slotSection }),
  setParkingSlotRow: (slotRow) => set({ slotRow }),
  setParkingSlotType: (slotType) => set({ slotType }),
  setParkingSlotFeePerHour: (slotFeePerHour) => set({ slotFeePerHour }),
  setParkingSlotStatus: (slotStatus) => set({ slotStatus }),

  // Create a new parking slot
  createParkingSlot: async () => {
    set({ isLoading: true, error: null, success: null });
    try {
      const slotData = {
        slotId: useParkingSlotStore.getState().slotId,
        slotSection: useParkingSlotStore.getState().slotSection,
        slotRow: useParkingSlotStore.getState().slotRow,
        slotType: useParkingSlotStore.getState().slotType,
        slotFeePerHour: useParkingSlotStore.getState().slotFeePerHour,
        slotStatus: useParkingSlotStore.getState().slotStatus,
      };

      const response = await axios.post(`${API_BASE_URL}/add_slot`, slotData);

      set({
        success: response.data.message || "Parking slot created successfully",
        isLoading: false,
        slotId: "",
        slotSection: "",
        slotRow: "",
        slotType: "",
        slotFeePerHour: 0,
        slotStatus: "Available",
      });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
    }
  },

  // Read: Fetch all parking slots
  fetchParkingSlots: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE_URL}/get_slots`);
      set({ parkingSlots: response.data || [], isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
    }
  },

  // Read: Fetch a single parking slot by ID
  fetchParkingSlotById: async (slotId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE_URL}/get/${slotId}`);
      set({ singleParkingSlot: response.data.data || null, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
    }
  },

  // Load parking slot data for editing
  loadParkingSlotForEdit: (slot) =>
    set({
      slotId: slot.slotId,
      slotSection: slot.slotSection,
      slotRow: slot.slotRow,
      slotType: slot.slotType,
      slotFeePerHour: slot.slotFeePerHour,
      slotStatus: slot.slotStatus,
    }),

  // Update an existing parking slot
  updateParkingSlot: async (slotId) => {
    set({ isLoading: true, error: null, success: null });
    try {
      const slotData = {
        slotId: useParkingSlotStore.getState().slotId,
        slotSection: useParkingSlotStore.getState().slotSection,
        slotRow: useParkingSlotStore.getState().slotRow,
        slotType: useParkingSlotStore.getState().slotType,
        slotFeePerHour: useParkingSlotStore.getState().slotFeePerHour,
        slotStatus: useParkingSlotStore.getState().slotStatus,
      };

      const response = await axios.put(`${API_BASE_URL}/update/${slotId}`, slotData);

      set((state) => ({
        success: response.data.message || "Parking slot updated successfully",
        isLoading: false,
        parkingSlots: state.parkingSlots.map((slot) =>
          slot.slotId === slotId ? { ...slot, ...slotData } : slot
        ),
        slotId: "",
        slotSection: "",
        slotRow: "",
        slotType: "",
        slotFeePerHour: 0,
        slotStatus: "Available",
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
    }
  },

  // Delete a parking slot
  deleteParkingSlot: async (slotId) => {
    set({ isLoading: true, error: null, success: null });
    try {
      const response = await axios.delete(`${API_BASE_URL}/delete/${slotId}`);
      set((state) => ({
        success: response.data.message || "Parking slot deleted successfully",
        isLoading: false,
        parkingSlots: state.parkingSlots.filter((slot) => slot.slotId !== slotId),
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
    }
  },
}));

export default useParkingSlotStore;
