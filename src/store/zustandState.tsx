import { create } from 'zustand';


interface WellState {
  well: string;
  updateWell: (well: string) => void;
}


const useWellStore = create<WellState>((set) => ({
  well: "SPH-04", 
  updateWell: (well: string) => set({ well }),  
}));

export default useWellStore;