import { create } from 'zustand';

interface GameState {
    activeStopIndex: number | null;
    setActiveStopIndex: (index: number | null) => void;
    progress: number;
    setProgress: (progress: number) => void;
}

export const useStore = create<GameState>((set) => ({
    activeStopIndex: null,
    setActiveStopIndex: (index) => set({ activeStopIndex: index }),
    progress: 0,
    setProgress: (progress) => set({ progress }),
}));
