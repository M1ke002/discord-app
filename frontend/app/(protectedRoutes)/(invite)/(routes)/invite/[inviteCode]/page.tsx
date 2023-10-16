'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useAxiosAuth from '@/hooks/useAxiosAuth';

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
}

const InviteCodePage = ({ params }: InviteCodePageProps) => {
  const { data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      console.log('no session');
      router.replace('/login');
      return;
    }

    if (!params.inviteCode) {
      router.replace('/');
      return;
    }

    const joinServer = async () => {
      try {
        const res = await axiosAuth.put(
          `/servers/join/${params.inviteCode}?userId=${session.user.id}`
        );
        //if the user successfully joined server OR the user already a member of the server
        if (res.status == 200) {
          console.log('Joined server successfully!');
        }
        if (res.data.serverId) {
          router.push(`/servers/${res.data.serverId}`);
        } else {
          router.replace('/');
        }
      } catch (error) {
        //problem: 400 (Bad Request) goes here, not the if statement in try block
        console.log(error);
        router.replace('/');
      }
    };
    joinServer();
  }, []);

  //this page doesn't render anything
  // return null;
  return <div>Joining server...</div>;
};

export default InviteCodePage;
