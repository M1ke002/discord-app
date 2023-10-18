'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useAxiosAuth from '@/hooks/useAxiosAuth';
import Channel from '@/types/Channel';
import { useMemberList } from '@/hooks/zustand/useMemberList';
import { useServerChannel } from '@/hooks/zustand/useServerChannel';
import { cn } from '@/lib/utils';

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
  const { channel, setChannel } = useServerChannel();
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
          setChannel(res.data);
        }
      } catch (error) {}
    };
    fetchChannelData();
  }, []);

  // if (channel) {
  return (
    <div className={cn('h-full w-full', isMemberListOpen && 'md:pr-[240px]')}>
      Chat messages Lorem Ipsum is simply dummy text of the printing and
      typesetting industry. Lorem Ipsum has been the industry's standard dummy
      text ever since the 1500s, when an unknown printer took a galley of type
      and scrambled it to make a type specimen book. It has survived not only
      five centuries, but also the leap into electronic typesetting, remaining
      essentially unchanged. It was popularised in the 1960s with the release of
      Letraset sheets containing Lorem Ipsum passages, and more recently with
      desktop publishing software like Aldus PageMaker including versions of
      Lorem Ipsum.
    </div>

    // <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
    //   <ChatHeader
    //     name={channel ? channel.name : ''}
    //     type="channel"
    //     serverId={params.serverId}
    //   />
    //   <div className="flex flex-auto justify-between">
    //     {/* content and member list */}
    //     <div
    //       className={cn('h-full w-full', isMemberListOpen && 'md:pr-[240px]')}
    //     >
    //       Chat messages Lorem Ipsum is simply dummy text of the printing and
    //       typesetting industry. Lorem Ipsum has been the industry's standard
    //       dummy text ever since the 1500s, when an unknown printer took a galley
    //       of type and scrambled it to make a type specimen book. It has survived
    //       not only five centuries, but also the leap into electronic
    //       typesetting, remaining essentially unchanged. It was popularised in
    //       the 1960s with the release of Letraset sheets containing Lorem Ipsum
    //       passages, and more recently with desktop publishing software like
    //       Aldus PageMaker including versions of Lorem Ipsum.
    //     </div>
    //   </div>
    // </div>
  );
  // }
};

export default ChannelIDpage;
