import { create } from 'zustand';

interface AroundMessageStore {
  aroundMessageId: string | null;
  messageChannelId: string | null;
  setAroundMessage: (
    messageId: string | null,
    channelId: string | null
  ) => void;
}

export const useAroundMessage = create<AroundMessageStore>((set) => ({
  aroundMessageId: null,
  messageChannelId: null,
  setAroundMessage: (messageId, channelId) =>
    set({ aroundMessageId: messageId, messageChannelId: channelId })
}));
