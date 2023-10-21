'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useAxiosAuth from '@/hooks/useAxiosAuth';
import { useMemberList } from '@/hooks/zustand/useMemberList';
import ChatInput from '@/components/chat/ChatInput';
import { useChatHeaderData } from '@/hooks/zustand/useChatHeaderData';
import { cn } from '@/lib/utils';
import ChatMessages from '@/components/chat/ChatMessages';

interface ChannelIDpageProps {
  params: {
    channelId: string;
    serverId: string;
  };
}

const ChannelIDpage = ({ params }: ChannelIDpageProps) => {
  const { data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const router = useRouter();
  // const { channel, setChannel } = useServerChannel();
  const { setChatHeaderData } = useChatHeaderData();
  const { isMemberListOpen } = useMemberList();

  useEffect(() => {
    if (!session) {
      console.log('no session');
      router.replace('/login');
      return;
    }

    const fetchChannelData = async () => {
      try {
        const res = await axiosAuth.get(`/channels/${params.channelId}`);
        if (res.status == 200) {
          setChatHeaderData(res.data.name, 'channel');
        }
      } catch (error) {}
    };
    fetchChannelData();
  }, []);

  return (
    <div
      className={cn(
        'flex flex-col w-full h-full',
        isMemberListOpen && 'md:pr-[240px]'
      )}
    >
      <ChatMessages type="channel" />
      <ChatInput />
    </div>
  );
};

export default ChannelIDpage;
