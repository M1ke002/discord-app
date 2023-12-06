import ChannelMessage from '@/types/ChannelMessage';
import DirectMessage from '@/types/DirectMessage';
import { create } from 'zustand';

interface ClickedMessageIdStore {
  clickedMessage: ChannelMessage | DirectMessage | null;
  setClickedMessage: (message: ChannelMessage | DirectMessage | null) => void;
}

export const useClickedMessage = create<ClickedMessageIdStore>((set) => ({
  clickedMessage: null,
  setClickedMessage: (message) => set({ clickedMessage: message })
}));
