'use client';

import ServerSidebar from '@/components/server/ServerSidebar';
import ChatHeader from '@/components/chat/ChatHeader';
import React from 'react';
import { usePathname } from 'next/navigation';

const ServerLayout = ({
  children,
  params
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const pathName = usePathname();
  console.log('in server layout');
  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0 bg-black">
        {/* server channels sidebar */}
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className="h-full md:pl-60">
        {!pathName.startsWith(`/servers/${params.serverId}/channels`) && (
          // for rendering skeleton when data not loaded yet
          <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader
              name={'SKELETON'}
              type="channel"
              serverId={params.serverId}
            />
          </div>
        )}
        {children}
      </main>
    </div>
  );
};

export default ServerLayout;
