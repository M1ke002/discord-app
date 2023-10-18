import { create } from 'zustand';

interface ClientStore {
  refetchServerSidebar: object;
  refetchNavbar: object;
  triggerRefetchComponents: (componentNames: string[]) => void;
}

export const useRefetchComponents = create<ClientStore>((set) => ({
  refetchServerSidebar: {},
  refetchNavbar: {},
  triggerRefetchComponents: (componentNames) => {
    componentNames.forEach((componentName) => {
      if (componentName === 'ServerSidebar') {
        console.log('setRefetchServerSidebar');
        // set({ refetchServerSidebar: {} });
        set((state) => ({ ...state, refetchServerSidebar: {} }));
      } else if (componentName === 'Navbar') {
        // set({ refetchNavbar: {} });
        set((state) => ({ ...state, refetchNavbar: {} }));
      }
    });
  }
}));
