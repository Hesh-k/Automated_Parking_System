import { create } from 'zustand';

export const useNumberPlateStore = create((set) => ({
  plateData: { number_plate: null, timestamp: null },
  setPlateData: (data) => set({ plateData: data }),
}));