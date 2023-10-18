import { create } from 'zustand';

interface MemberListStore {
  isMemberListOpen: boolean;
  toggleMemberList: () => void;
}

export const useMemberList = create<MemberListStore>((set) => ({
  isMemberListOpen: false,
  toggleMemberList: () =>
    set((state) => ({ isMemberListOpen: !state.isMemberListOpen }))
}));
