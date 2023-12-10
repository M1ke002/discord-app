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
import { useMessageTracker } from '@/hooks/zustand/useMessageTracker';
import Member from '@/types/Member';

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
  const { clearBottomMessageTracker, clearTopMessageTracker } =
    useMessageTracker();

  useEffect(() => {
    setShowChat(false);
  }, [pathName, setShowChat]);

  // useEffect(() => {
  //   clearBottomMessageTracker();
  //   clearTopMessageTracker();
  // }, []);

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
          const server = serverResponse.data;
          if (
            !server.users.find(
              (member: Member) => member.id === session.user.id
            )
          ) {
            console.log('member not found');
            router.replace('/');
            return;
          } else {
            setServer(server);
          }
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
      return null;
    } else {
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
          {(channel.type === 'VOICE' || channel.type === 'VIDEO') && (
            <div className="flex items-center h-full overflow-x-hidden">
              <LiveKitRoomProvider
                chatId={channel.id.toString()}
                isAudio={true}
                isVideo={false}
              >
                <MediaRoom type="channelCall" />
              </LiveKitRoomProvider>
              {showChat && (
                <div className="flex flex-col h-full min-w-[440px] max-w-[440px]">
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
  }
};

export default ChannelIDpage;
