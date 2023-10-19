import { create } from 'zustand';

interface ChatHeaderDataStore {
  name: string;
  type: 'channel' | 'conversation';
  setChatHeaderData: (name: string, type: 'channel' | 'conversation') => void;
}

export const useChatHeaderData = create<ChatHeaderDataStore>((set) => ({
  name: '',
  type: 'channel',
  setChatHeaderData: (name, type) => set(() => ({ name, type }))
}));
