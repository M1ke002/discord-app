import { create } from 'zustand';

interface ChatHeaderDataStore {
  type: 'channel' | 'conversations' | 'conversation';
  name: string;
  imageUrl?: string;
  setChatHeaderData: (
    type: 'channel' | 'conversations' | 'conversation',
    name: string,
    imageUrl?: string
  ) => void;
}

export const useChatHeaderData = create<ChatHeaderDataStore>((set) => ({
  type: 'channel',
  name: '',
  imageUrl: '',
  setChatHeaderData: (type, name, imageUrl) =>
    set(() => ({ type, name, imageUrl }))
}));
