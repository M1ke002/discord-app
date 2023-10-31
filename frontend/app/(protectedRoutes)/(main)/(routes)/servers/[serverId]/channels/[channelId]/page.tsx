'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useAxiosAuth from '@/hooks/useAxiosAuth';
import { useMemberList } from '@/hooks/zustand/useMemberList';
import ChatInput from '@/components/chat/ChatInput';
import { useChatHeaderData } from '@/hooks/zustand/useChatHeaderData';
import { useServerChannelData } from '@/hooks/zustand/useServerChannelData';
import { useServerData } from '@/hooks/zustand/useServerData';
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
  const { type, setChatHeaderData } = useChatHeaderData();
  const { channel, setChannel } = useServerChannelData();
  const { server, setServer } = useServerData();
  const { isMemberListOpen } = useMemberList();

  useEffect(() => {
    if (!session) {
      console.log('no session');
      router.replace('/login');
      return;
    }

    const fetchChannelData = async () => {
      try {
        const channelResponse = await axiosAuth.get(
          `/channels/${params.channelId}`
        );
        if (channelResponse.status == 200) {
          setChatHeaderData(channelResponse.data.name, 'channel');
          setChannel(channelResponse.data);
        }
        const serverResponse = await axiosAuth.get(
          `/servers/${params.serverId}`
        );
        if (serverResponse.status == 200) {
          setServer(serverResponse.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchChannelData();
  }, []);

  if (channel && server && session) {
    const member = server.users.find((member) => member.id === session.user.id);
    if (!member) {
      console.log('member not found');
      return;
    }

    return (
      <div
        className={cn(
          'flex flex-col w-full h-full md:pr-[3px]',
          isMemberListOpen && type === 'channel' && 'md:pr-[243px]'
        )}
      >
        <ChatMessages
          type="channel"
          apiUrl="/messages"
          paramKey="channelId"
          paramValue={params.channelId}
          chatId={params.channelId}
          userId={session.user.id.toString()}
          serverId={params.serverId}
          channelId={params.channelId}
          name={channel.name}
          currMember={member}
        />
        <ChatInput
          apiUrl="/messages"
          channelId={params.channelId}
          userId={session.user.id.toString()}
          serverId={params.serverId}
        />
      </div>
    );
  }
};

export default ChannelIDpage;
