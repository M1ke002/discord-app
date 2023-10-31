'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useAxiosAuth from '@/hooks/useAxiosAuth';
import { useChatHeaderData } from '@/hooks/zustand/useChatHeaderData';
import { useUserProfile } from '@/hooks/zustand/useUserProfile';
import ChatInput from '@/components/chat/ChatInput';
import ChatMessages from '@/components/chat/ChatMessages';
import { cn } from '@/lib/utils';

interface ConversationPageProps {
  params: {
    userId: string;
  };
}

const ConversationPage = ({ params }: ConversationPageProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const axiosAuth = useAxiosAuth();
  const { type, setChatHeaderData } = useChatHeaderData();
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

  if (session) {
    return (
      <div
        className={cn(
          'flex flex-col w-full h-full',
          isUserProfileOpen && type === 'conversation' && 'md:pr-[340px]'
        )}
      >
        <ChatMessages
          type="conversation"
          apiUrl="/direct-messages"
          paramKey="userId"
          paramValue={params.userId}
          chatId={params.userId}
          userId={session.user.id.toString()}
          currUser={session.user}
          name="Mitty"
          avatarUrl={session.user.avatarUrl || ''}
        />
        <ChatInput apiUrl="/direct-messages" />
      </div>
    );
  }
};

export default ConversationPage;
