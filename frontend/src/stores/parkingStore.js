import { create } from 'zustand';

export const useParkingStore = create((set) => ({
  parkingData: { free_spaces: 0, occupied_spaces: 0 },
  setParkingData: (data) => set({ parkingData: data }),
}));