import {create} from 'zustand';
import { IServerOptionalProps } from '@/utils/constants';

export type ModalType = 'createServer' | 'editServer' | 'leaveServer' | 'deleteServer' | 'members' | 'createChannel' | 'invite';

interface ModalData extends IServerOptionalProps{
    // server?: {
    //     name: string;
    //     channels: { type: string }[];
    //     members: { profileId: string; name: string; role: string, avatarUrl: string }[];
    //     inviteCode: string;
    //     imageUrl: string | null;
    // },
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
    onOpen: (type: ModalType, data = {}) => set({type, isOpen: true, data}), //default value for data is empty object if not provided
    onClose: () => set({type: null, isOpen: false}),
}));