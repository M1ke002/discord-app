import { create } from 'zustand';

interface IsMicrophoneMutedStore {
  muted: boolean;
  setMuted: (muted: boolean) => void;
}

export const useIsMicrophoneMuted = create<IsMicrophoneMutedStore>((set) => ({
  muted: localStorage.getItem('muted') === 'true',
  setMuted: (muted) => set({ muted })
}));
