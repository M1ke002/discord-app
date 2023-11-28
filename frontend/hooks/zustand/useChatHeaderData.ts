import { ChannelType } from '@/utils/constants';
import { create } from 'zustand';

interface ChatHeaderDataStore {
  type: 'channel' | 'conversations' | 'conversation';
  name: string;
  imageUrl?: string;
  channelType?: ChannelType;
  setChatHeaderData: (
    type: 'channel' | 'conversations' | 'conversation',
    name: string,
    imageUrl?: string,
    channelType?: ChannelType
  ) => void;
}

export const useChatHeaderData = create<ChatHeaderDataStore>((set) => ({
  type: 'channel',
  name: '',
  imageUrl: '',
  channelType: ChannelType.TEXT,
  setChatHeaderData: (type, name, imageUrl, channelType) =>
    set({ type, name, imageUrl, channelType })
}));
