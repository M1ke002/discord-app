//2 possible paths: /servers/serverId/channels/channelId and /conversations/userId
'use client';

import ChatHeader from '@/components/chat/ChatHeader';
import ConversationSidebar from '@/components/conversation/ConversationSidebar';
import UserProfile from '@/components/server/UserProfile';
import React from 'react';

const ConversationLayout = ({
  children,
  params
}: {
  children: React.ReactNode;
  params: { serverId: string; userId: string };
}) => {
  // console.log('in conversation layout');

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0 bg-black">
        {/* Conversation sidebar */}
        <ConversationSidebar />
      </div>
      <main className="h-full md:pl-60">
        <div className="bg-white dark:bg-[color:var(--primary-dark)] flex flex-col h-full">
          <ChatHeader serverId={params.serverId} />
          {/* 48px is the height of chat header */}
          <div className="flex h-[calc(100%-48px)]">
            {children}
            <div className="hidden md:block fixed right-0 h-full z-20">
              <UserProfile />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConversationLayout;
