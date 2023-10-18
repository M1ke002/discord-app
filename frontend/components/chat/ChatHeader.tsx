'use client';

import { Hash, Users } from 'lucide-react';
import React from 'react';
import MobileSidebarToggle from '../MobileSidebarToggle';
import { useSession } from 'next-auth/react';
import useAxiosAuth from '@/hooks/useAxiosAuth';
import { useMemberList } from '@/hooks/zustand/useMemberList';
import MobileMemberListToggle from '../MobileMemberListToggle';
import { useServerChannel } from '@/hooks/zustand/useServerChannel';

interface ChatHeaderProps {
  serverId: string;
  type: 'channel' | 'conversation';
  imageUrl?: string;
}

const ChatHeader = ({ serverId, type, imageUrl }: ChatHeaderProps) => {
  const { data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const { toggleMemberList } = useMemberList();
  const { channel } = useServerChannel();

  const testAPI = async () => {
    // const session = await getSession();
    console.log(session);
    try {
      const res = await axiosAuth.get('/auth/test');
      console.log(res.data);
      alert(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="text-md font-semibold px-3 flex items-center justify-between h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      <div className="flex items-center">
        <MobileSidebarToggle serverId={serverId} />
        {type === 'channel' && (
          <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
        )}
        <p
          className="font-semibold text-md text-black dark:text-white"
          onClick={testAPI}
        >
          {channel?.name}
        </p>
      </div>
      {/*  Header actions */}
      <div>
        <Users
          className="hidden md:block w-5 h-5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition cursor-pointer"
          onClick={toggleMemberList}
        />
        <MobileMemberListToggle serverId={serverId} />
      </div>
    </div>
  );
};

export default ChatHeader;
