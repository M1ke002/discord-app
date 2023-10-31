import { create } from 'zustand';

interface ChatHeaderDataStore {
  name: string;
  type: 'channel' | 'conversations' | 'conversation';
  setChatHeaderData: (
    name: string,
    type: 'channel' | 'conversations' | 'conversation'
  ) => void;
}

export const useChatHeaderData = create<ChatHeaderDataStore>((set) => ({
  name: '',
  type: 'channel',
  setChatHeaderData: (name, type) => set(() => ({ name, type }))
}));
