import ChannelMessage from '@/types/ChannelMessage';
import { create } from 'zustand';

//hook to store the server channel data fetched from the server
interface ReplyToMessageStore {
  message: ChannelMessage | null;
  setMessage: (message: ChannelMessage | null) => void;
}

export const useReplyToMessage = create<ReplyToMessageStore>((set) => ({
  message: null,
  setMessage: (message) => set(() => ({ message }))
}));
