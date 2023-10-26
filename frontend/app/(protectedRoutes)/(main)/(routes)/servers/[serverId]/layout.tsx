'use client';

import ServerSidebar from '@/components/server/ServerSidebar';
import ChatHeader from '@/components/chat/ChatHeader';
import React from 'react';
import MemberList from '@/components/server/MemberList';
import UserProfile from '@/components/server/UserProfile';

const ServerLayout = ({
  children,
  params
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  // console.log('in server layout');

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0 bg-black">
        {/* server channels sidebar */}
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className="h-full md:pl-60">
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
          <ChatHeader serverId={params.serverId} />
          {/* 48px is the height of chat header */}
          <div className="flex h-[calc(100%-48px)]">
            {children}
            <div className="hidden md:block fixed right-0 h-full z-20">
              <MemberList serverId={params.serverId} />
              <UserProfile />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServerLayout;
