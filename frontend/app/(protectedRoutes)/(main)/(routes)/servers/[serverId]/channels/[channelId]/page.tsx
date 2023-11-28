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
import { useToggleChat } from '@/hooks/zustand/useToggleChat';
import { cn } from '@/lib/utils';
import ChatMessages from '@/components/chat/ChatMessages';
import MediaRoom from '@/components/media/MediaRoom';
import LiveKitRoomProvider from '@/components/providers/LiveKitRoomProvider';
import { usePathname } from 'next/navigation';
import { ChannelType } from '@/utils/constants';

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
  const { type, channelType, setChatHeaderData } = useChatHeaderData();
  const { channel, setChannel } = useServerChannelData();
  const { server, setServer } = useServerData();
  const { isMemberListOpen } = useMemberList();
  const { showChat, setShowChat } = useToggleChat();
  const pathName = usePathname();

  useEffect(() => {
    setShowChat(false);
  }, [pathName, setShowChat]);

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
          setChatHeaderData(
            'channel',
            channelResponse.data.name,
            undefined,
            channelResponse.data.type
          );
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
        router.replace(`/servers/${params.serverId}`);
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
          isMemberListOpen &&
            type === 'channel' &&
            channelType === ChannelType.TEXT &&
            'md:pr-[243px]'
        )}
      >
        {channel.type === 'VOICE' && (
          <div className="flex items-center h-full overflow-x-hidden">
            <LiveKitRoomProvider
              chatId={channel.id.toString()}
              isAudio={true}
              isVideo={false}
            >
              <MediaRoom type="channelCall" />
            </LiveKitRoomProvider>
            {showChat && (
              <div className="flex flex-col h-full max-w-[450px]">
                <ChatMessages
                  type="channel"
                  apiUrl="/messages"
                  currUser={member}
                  serverId={params.serverId}
                  channelId={params.channelId}
                  chatWelcomeName={channel.name}
                />
                <ChatInput
                  apiUrl="/messages"
                  userId={session.user.id.toString()}
                  channelId={params.channelId}
                  serverId={params.serverId}
                />
              </div>
            )}
          </div>
        )}
        {channel.type === 'VIDEO' && (
          <LiveKitRoomProvider
            chatId={`channelCall:${channel.id}`}
            isAudio={true}
            isVideo={false}
          >
            <MediaRoom type="channelCall" />
          </LiveKitRoomProvider>
        )}
        {channel.type === 'TEXT' && (
          <>
            <ChatMessages
              type="channel"
              apiUrl="/messages"
              currUser={member}
              serverId={params.serverId}
              channelId={params.channelId}
              chatWelcomeName={channel.name}
            />
            <ChatInput
              apiUrl="/messages"
              userId={session.user.id.toString()}
              channelId={params.channelId}
              serverId={params.serverId}
            />
          </>
        )}
      </div>
    );
  }
};

export default ChannelIDpage;
