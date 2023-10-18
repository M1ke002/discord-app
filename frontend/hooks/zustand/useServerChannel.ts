import Channel from '@/types/Channel';
import { create } from 'zustand';

//hook to store the server channel data fetched from the server
interface ServerChannelStore {
  channel: Channel | null;
  setChannel: (channel: Channel) => void;
}

export const useServerChannel = create<ServerChannelStore>((set) => ({
  channel: null,
  setChannel: (channel) => set(() => ({ channel }))
}));
