import ChannelMessage from '@/types/ChannelMessage';
import DirectMessage from '@/types/DirectMessage';
import { create } from 'zustand';

//hook to store the server channel data fetched from the server
interface ReplyToMessageStore {
  message: ChannelMessage | DirectMessage | null;
  setMessage: (message: ChannelMessage | DirectMessage | null) => void;
}

export const useReplyToMessage = create<ReplyToMessageStore>((set) => ({
  message: null,
  setMessage: (message) => set(() => ({ message }))
}));
