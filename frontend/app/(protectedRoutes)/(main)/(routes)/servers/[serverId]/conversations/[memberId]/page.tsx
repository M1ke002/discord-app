'use client';

import React from 'react';
import { useEffect } from 'react';
import { useChatHeaderData } from '@/hooks/zustand/useChatHeaderData';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useAxiosAuth from '@/hooks/useAxiosAuth';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';
import { cn } from '@/lib/utils';
import { useUserProfile } from '@/hooks/zustand/useUserProfile';

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
}

const MemberIdPage = ({ params }: MemberIdPageProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const axiosAuth = useAxiosAuth();
  const { setChatHeaderData } = useChatHeaderData();
  const { isUserProfileOpen } = useUserProfile();

  useEffect(() => {
    if (!session) {
      console.log('no session');
      router.replace('/login');
      return;
    }

    const fetchConversationData = async () => {};

    console.log('in conversation page');
    setChatHeaderData('user name', 'conversation');
  }, []);

  return (
    <div
      className={cn(
        'flex flex-col w-full h-full',
        isUserProfileOpen && 'md:pr-[340px]'
      )}
    >
      <ChatMessages type="conversation" name="Mitty" />
      <ChatInput />
    </div>
  );
};

export default MemberIdPage;
