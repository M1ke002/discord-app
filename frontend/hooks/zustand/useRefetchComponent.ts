import { create } from 'zustand';

interface ClientStore {
  refetchServerSidebar: object;
  refetchNavbar: object;
  refetchMemberList: object;
  triggerRefetchComponents: (componentNames: string[]) => void;
}

export const useRefetchComponents = create<ClientStore>((set) => ({
  refetchServerSidebar: {},
  refetchNavbar: {},
  refetchMemberList: {},
  triggerRefetchComponents: (componentNames) => {
    componentNames.forEach((componentName) => {
      if (componentName === 'ServerSidebar') {
        console.log('setRefetchServerSidebar');
        // set({ refetchServerSidebar: {} });
        set((state) => ({ ...state, refetchServerSidebar: {} }));
      } else if (componentName === 'Navbar') {
        // set({ refetchNavbar: {} });
        set((state) => ({ ...state, refetchNavbar: {} }));
      } else if (componentName === 'MemberList') {
        set((state) => ({ ...state, refetchMemberList: {} }));
      }
    });
  }
}));
