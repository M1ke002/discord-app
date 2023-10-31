'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ServerHeader from '../server/ServerHeader';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { getChannelIcon, getRoleIcon } from '@/utils/constants';
import { ChannelType, MemberRole } from '@/utils/constants';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import useAxiosAuth from '@/hooks/useAxiosAuth';
import { usePathname } from 'next/navigation';
import ServerSidebarSkeleton from '../skeleton/ServerSidebarSkeleton';
import { useRefetchComponents } from '@/hooks/zustand/useRefetchComponent';
import { dummyConversationList } from '@/utils/constants';
import SidebarSearch from '../server/SidebarSearch';
import ConversationItem from './ConversationItem';
import UserAccount from '../server/UserAccount';

//maps channel type to icon

const ConversationSidebar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const axiosAuth = useAxiosAuth();
  const pathName = usePathname();

  //this newPath is used as the dependecy to refetch serveInfo from backend
  const newPath = pathName.substring(0, pathName.lastIndexOf('/'));

  useEffect(() => {
    if (!session) {
      console.log('no session');
      router.replace('/login');
      return;
    }
  }, []);

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader type="conversation" />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <SidebarSearch sidebarType="conversation" />
        </div>

        <Separator className="bg-zinc-200 dark:bg-zinc-700 my-2 rounded-md" />

        <div className="py-1">
          <div className="group">
            <p className="flex items-center text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-200 transition py-2 px-2">
              Direct messages
            </p>
          </div>

          {dummyConversationList.map((conversation, index) => (
            <ConversationItem
              key={index}
              id={conversation.id.toString()}
              name={conversation.name}
              avatarUrl={conversation.avatarUrl}
            />
          ))}
        </div>
      </ScrollArea>
      <UserAccount
        avatarUrl={session?.user.avatarUrl || ''}
        username={session?.user.username || ''}
        nickname={session?.user.nickname || ''}
      />
    </div>
  );
};

export default ConversationSidebar;
