import React from 'react';

import { useToggleChat } from '@/hooks/zustand/useToggleChat';
import { cn } from '@/lib/utils';

const CustomChatToggle = ({ children }: { children: React.ReactNode }) => {
  const { showChat, setShowChat } = useToggleChat();

  return (
    <button
      className={cn(
        'flex items-center lk-button lk-chat-toggle',
        showChat && '!bg-[#373737]'
      )}
      onClick={() => setShowChat(!showChat)}
    >
      {children}
    </button>
  );
};

export default CustomChatToggle;
