'use client';

import { Hash } from 'lucide-react';
import React from 'react';
import MobileToggle from '../MobileToggle';
import axios from '@/lib/axiosConfig';
import { useSession } from 'next-auth/react';
import useAxiosAuth from '@/hooks/useAxiosAuth';

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: 'channel' | 'conversation';
  imageUrl?: string;
}

const ChatHeader = ({ serverId, name, type, imageUrl }: ChatHeaderProps) => {
  const { data: session } = useSession();
  const axiosAuth = useAxiosAuth();

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
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      <MobileToggle serverId={serverId} />
      {type === 'channel' && (
        <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      )}
      <p className="font-semibold text-md text-black dark:text-white">{name}</p>
      <button onClick={testAPI}>Test API</button>
    </div>
  );
};

export default ChatHeader;
