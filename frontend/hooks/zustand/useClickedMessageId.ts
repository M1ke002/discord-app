import { create } from 'zustand';

interface ClickedMessageIdStore {
  clickedMessageId: string;
  setClickedMessageId: (id: string) => void;
}

export const useClickedMessageId = create<ClickedMessageIdStore>((set) => ({
  clickedMessageId: '',
  setClickedMessageId: (id) => set({ clickedMessageId: id })
}));
