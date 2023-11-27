import { create } from 'zustand';

interface ToggleChatStore {
  showChat: boolean;
  setShowChat: (showChat: boolean) => void;
}

export const useToggleChat = create<ToggleChatStore>((set) => ({
  showChat: false,
  setShowChat: (showChat) => set({ showChat })
}));
