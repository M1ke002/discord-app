'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ServerHeader from '../server/ServerHeader';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import useAxiosAuth from '@/hooks/useAxiosAuth';
import ServerSidebarSkeleton from '../skeleton/ServerSidebarSkeleton';
import { useRefetchComponents } from '@/hooks/zustand/useRefetchComponent';
import SidebarSearch from '../server/SidebarSearch';
import ConversationItem from './ConversationItem';
import UserAccount from '../server/UserAccount';
import Conversation from '@/types/Conversation';

//maps channel type to icon

const ConversationSidebar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const axiosAuth = useAxiosAuth();
  const [conversationList, setConversationList] = useState<Conversation[]>([]);
  const { refetchConversationSidebar } = useRefetchComponents();

  useEffect(() => {
    if (!session) {
      console.log('no session');
      router.replace('/login');
      return;
    }

    const fetchConversations = async () => {
      console.log('fetching conversation list...');
      try {
        const res = await axiosAuth.get(`/conversations/${session.user.id}`);
        console.log(res.data);
        setConversationList(res.data);
      } catch (error) {
        console.log('[ConversationSidebar] sussy: ' + error);
        return;
      }
    };

    fetchConversations();
  }, [refetchConversationSidebar]);

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[color:var(--sidebar-dark)] bg-[color:var(--sidebar-light)]">
      <ServerHeader type="conversation" />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <SidebarSearch
            sidebarType="conversation"
            conversationData={{
              items: conversationList.map((conversation) => ({
                id: conversation.otherUser.id,
                name: conversation.otherUser.nickname,
                avatarUrl: conversation.otherUser.file?.fileUrl || ''
              }))
            }}
          />
        </div>

        <Separator className="bg-zinc-200 dark:bg-zinc-700 my-2 rounded-md" />

        <div className="py-1">
          <div className="group">
            <p className="flex items-center text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition py-2 px-2">
              Direct messages
            </p>
          </div>

          {conversationList.map((conversation, index) => (
            <ConversationItem
              key={index}
              id={conversation.otherUser.id.toString()}
              name={conversation.otherUser.nickname}
              avatarUrl={conversation.otherUser.file?.fileUrl || ''}
            />
          ))}
        </div>
      </ScrollArea>
      <UserAccount />
    </div>
  );
};

export default ConversationSidebar;
