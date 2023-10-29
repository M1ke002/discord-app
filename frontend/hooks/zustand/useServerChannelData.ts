import Channel from '@/types/Channel';
import { create } from 'zustand';

//hook to store the server channel data fetched from the server
interface ServerChannelDataStore {
  channel: Channel | null;
  setChannel: (channel: Channel) => void;
}

export const useServerChannelData = create<ServerChannelDataStore>((set) => ({
  channel: null,
  setChannel: (channel) => set(() => ({ channel }))
}));
