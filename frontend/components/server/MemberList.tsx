'use client';

import { useState, useEffect } from 'react';
import useAxiosAuth from '@/hooks/useAxiosAuth';
import Server from '@/types/Server';
import { useSession } from 'next-auth/react';
import { useMemberList } from '@/hooks/zustand/useMemberList';
import { cn } from '@/lib/utils';

const MemberList = ({ serverId }: { serverId: string }) => {
  const { data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const { isMemberListOpen } = useMemberList();
  const [server, setServer] = useState<Server>();

  useEffect(() => {
    if (!session) {
      console.log('no session');
      return;
    }

    const fetchServerInfo = async () => {
      try {
        console.log('fetch data in member list...');
        const response = await axiosAuth.get(`/servers/${serverId}`);
        const server = response.data;
        if (!server) {
          return;
        }
        setServer(server);
      } catch (error) {
        console.log('[MemberList] sussy: ' + error);
        return;
      }
    };
    fetchServerInfo();
  }, []);

  return (
    <div
      className={cn(
        'h-full w-full md:min-w-[240px] flex-col dark:bg-[#2B2D31] bg-[#F2F3F5]',
        !isMemberListOpen && 'md:hidden'
      )}
    >
      {server &&
        server.users.map((member) => {
          return <div key={member.id}>{member.nickname}</div>;
        })}
    </div>
  );
};

export default MemberList;
