import ChannelMessage from '@/types/ChannelMessage';
import DirectMessage from '@/types/DirectMessage';
import { create } from 'zustand';

interface MessageTrackerStore {
  topMessageTracker: {
    currentTopMessage: ChannelMessage | DirectMessage | null;
    prevTopMessage: ChannelMessage | DirectMessage | null;
  };
  bottomMessageTracker: {
    currentBottomMessage: ChannelMessage | DirectMessage | null;
    prevBottomMessage: ChannelMessage | DirectMessage | null;
  };
  setTopMessageTracker: (
    message: ChannelMessage | DirectMessage | null
  ) => void;
  setBottomMessageTracker: (
    message: ChannelMessage | DirectMessage | null
  ) => void;
  clearTopMessageTracker: () => void;
  clearBottomMessageTracker: () => void;
}

export const useMessageTracker = create<MessageTrackerStore>((set) => ({
  topMessageTracker: {
    currentTopMessage: null,
    prevTopMessage: null
  },
  bottomMessageTracker: {
    currentBottomMessage: null,
    prevBottomMessage: null
  },
  setTopMessageTracker: (message) =>
    set((state) => ({
      ...state,
      topMessageTracker: {
        currentTopMessage: message,
        prevTopMessage: state.topMessageTracker.currentTopMessage
      }
    })),
  setBottomMessageTracker: (message) =>
    set((state) => ({
      ...state,
      bottomMessageTracker: {
        currentBottomMessage: message,
        prevBottomMessage: state.bottomMessageTracker.currentBottomMessage
      }
    })),
  clearTopMessageTracker: () =>
    set((state) => ({
      ...state,
      topMessageTracker: {
        currentTopMessage: null,
        prevTopMessage: null
      }
    })),
  clearBottomMessageTracker: () =>
    set((state) => ({
      ...state,
      bottomMessageTracker: {
        currentBottomMessage: null,
        prevBottomMessage: null
      }
    }))
}));
