import { create } from 'zustand';

interface MemberListStore {
  isUserProfileOpen: boolean;
  toggleUserProfile: () => void;
}

export const useUserProfile = create<MemberListStore>((set) => ({
  isUserProfileOpen: false,
  toggleUserProfile: () =>
    set((state) => ({ isUserProfileOpen: !state.isUserProfileOpen }))
}));
