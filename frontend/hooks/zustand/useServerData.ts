import Server from '@/types/Server';
import { create } from 'zustand';

interface ServerDataStore {
  server: Server | null;
  setServer: (server: Server) => void;
}

export const useServerData = create<ServerDataStore>((set) => ({
  server: null,
  setServer: (server) => set(() => ({ server }))
}));
