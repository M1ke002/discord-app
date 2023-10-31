'use client';

import { useState, useEffect } from 'react';
import useAxiosAuth from '@/hooks/useAxiosAuth';
import Server from '@/types/Server';
import { useSession } from 'next-auth/react';
import { useMemberList } from '@/hooks/zustand/useMemberList';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import Member from '@/types/Member';
import MemberListItem from './MemberListItem';
import { useRefetchComponents } from '@/hooks/zustand/useRefetchComponent';
import { useChatHeaderData } from '@/hooks/zustand/useChatHeaderData';
import { getRoleIcon } from '@/utils/constants';
import { Minus } from 'lucide-react';

const MemberList = ({ serverId }: { serverId: string }) => {
  const { data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const { isMemberListOpen } = useMemberList();
  const { refetchMemberList } = useRefetchComponents();
  const { type } = useChatHeaderData();
  const [server, setServer] = useState<Server>();
  const [memberRoles, setMemberRoles] = useState<
    Array<{ role: string; count: number }>
  >([]);

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
        const memberRoles: Array<{ role: string; count: number }> = [];
        server.users.forEach((member: Member) => {
          const role = member.role;
          const index = memberRoles.findIndex(
            (userRole) => userRole.role === role
          );
          //if role doesnt exist in memberRoles, add it
          if (index === -1) {
            memberRoles.push({ role: role, count: 1 });
          } else {
            memberRoles[index].count += 1;
          }
        });
        setMemberRoles(memberRoles);
        setServer(server);
      } catch (error) {
        console.log('[MemberList] sussy: ' + error);
        return;
      }
    };
    fetchServerInfo();
  }, [refetchMemberList]);

  return (
    <div
      className={cn(
        'h-full w-full md:w-[240px] flex-col dark:bg-[#2B2D31] bg-[#F2F3F5]',
        (!isMemberListOpen ||
          type === 'conversation' ||
          type === 'conversations') &&
          'md:hidden'
      )}
    >
      <ScrollArea className="px-3 pb-4 pt-6">
        {server &&
          memberRoles.length > 0 &&
          // display members group by their roles
          memberRoles.map((userRole) => (
            <div key={userRole.role} className="mb-5">
              <p className="flex items-center mb-1 px-2 text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                {
                  getRoleIcon('h-4 w-4 mr-1')[
                    userRole.role as keyof typeof getRoleIcon
                  ]
                }
                {userRole.role}{' '}
                {userRole.role !== 'ADMIN' && (
                  <>
                    <Minus className="w-3 h-3 mx-1 text-zinc-500 dark:text-zinc-400" />
                    {userRole.count}
                  </>
                )}
              </p>
              <div>
                {server.users.map((member: Member) => {
                  if (member.role === userRole.role) {
                    return <MemberListItem key={member.id} member={member} />;
                  }
                })}
              </div>
            </div>
          ))}
      </ScrollArea>
    </div>
  );
};

export default MemberList;
