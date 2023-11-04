'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useAxiosAuth from '@/hooks/useAxiosAuth';
import { useChatHeaderData } from '@/hooks/zustand/useChatHeaderData';
import { useUserProfile } from '@/hooks/zustand/useUserProfile';
import ChatInput from '@/components/chat/ChatInput';
import ChatMessages from '@/components/chat/ChatMessages';
import { cn } from '@/lib/utils';
import User from '@/types/User';

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
  const [otherUser, setOtherUser] = useState<User>();

  useEffect(() => {
    if (!session) {
      console.log('no session');
      router.replace('/login');
      return;
    }

    //fetch the info of the other user you are chatting with
    const fetchOtherUserInfo = async () => {
      try {
        const res = await axiosAuth.get(`/users/${params.userId}`);
        setOtherUser(res.data);
        setChatHeaderData(
          'conversation',
          res.data.nickname,
          res.data.avatarUrl
        );
        console.log(res.data);
      } catch (error) {
        console.log('[fetchChatUser]', error);
        router.replace('/conversations');
      }
    };
    console.log('in conversation page');
    fetchOtherUserInfo();
  }, []);

  if (otherUser && session) {
    return (
      <div
        className={cn(
          'flex flex-col w-full h-full md:pr-[3px]',
          isUserProfileOpen && type === 'conversation' && 'md:pr-[343px]'
        )}
      >
        <ChatMessages
          type="conversation"
          apiUrl="/direct-messages"
          currUser={session.user}
          otherUser={otherUser}
          chatWelcomeName={otherUser?.nickname || ''}
        />
        <ChatInput
          apiUrl="/direct-messages"
          userId={session.user.id.toString()}
          otherUserId={params.userId}
        />
      </div>
    );
  }
};

export default ConversationPage;
