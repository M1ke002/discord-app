'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useAxiosAuth from '@/hooks/useAxiosAuth';
import Channel from '@/types/Channel';

interface ServerPageProps {
  params: {
    serverId: string;
  };
}

const ServerPage = ({ params }: ServerPageProps) => {
  const { data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      console.log('no session');
      router.replace('/login');
      return;
    }

    const fetchServerChannel = async () => {
      try {
        console.log('getting the server...');
        const response = await axiosAuth.get(`/servers/${params.serverId}`);
        // console.log(response.data);
        const server = response.data;
        // console.log('found server: '+JSON.stringify(server));

        //find the 'general' channel's id of the server
        const generalChannelId = server.channels.find(
          (channel: Channel) => channel.name === 'general'
        )?.id;
        console.log('general channel ID: ' + generalChannelId);
        if (generalChannelId) {
          // router.refresh();
          router.push(
            `/servers/${params.serverId}/channels/${generalChannelId}`
          );
        }
      } catch (error) {
        console.log('[serverId] sussy: ' + error);
        router.replace('/conversations');
        return null;
      }
    };

    if (session) {
      fetchServerChannel();
    }
  }, []);
};

export default ServerPage;
