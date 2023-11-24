import { create } from 'zustand';
import Server from '@/types/Server';
import Channel from '@/types/Channel';
import Category from '@/types/Category';
import { MemberRole } from '@/utils/constants';

export type ModalType =
  | 'newServerOptions'
  | 'joinServer'
  | 'createServer'
  | 'editServer'
  | 'leaveServer'
  | 'deleteServer'
  | 'members'
  | 'createChannel'
  | 'editChannel'
  | 'deleteChannel'
  | 'createCategory'
  | 'editCategory'
  | 'deleteCategory'
  | 'invite'
  | 'deleteMessage'
  | 'userSettings';

interface ModalData {
  server?: Server;
  serverId?: string;
  categories?: Category[];
  selectedCategory?: Category;
  memberRole?: MemberRole;
  channel?: Channel;
  channelId?: string;
  userId?: string;
  otherUserId?: string;
  messageType?: 'channelMessage' | 'directMessage';
  messageId?: string;
  fileKey?: string;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void; //the input data is optional ('?' symbol)
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type: ModalType, data = {}) => set({ type, isOpen: true, data }), //default value for data is empty object if not provided
  onClose: () => set({ type: null, isOpen: false })
}));
