'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import useAxiosAuth from '@/hooks/useAxiosAuth';
import { useSession } from 'next-auth/react';
import { useUserProfile } from '@/hooks/zustand/useUserProfile';
import { cn } from '@/lib/utils';
import { useChatHeaderData } from '@/hooks/zustand/useChatHeaderData';
import { Separator } from '../ui/separator';
import UserAvatar from '../UserAvatar';
import { useParams } from 'next/navigation';
import { getConversationIdFromUrl } from '@/utils/utils';
import User from '@/types/User';
import { format } from 'date-fns';

const UserProfile = () => {
  const params = useParams();
  const { data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const { isUserProfileOpen } = useUserProfile();
  const { type } = useChatHeaderData();
  const [user, setUser] = useState<User>();

  const userId = params.userId;

  useEffect(() => {
    if (!session) {
      console.log('no session');
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const res = await axiosAuth.get(`/users/${userId}`);
        console.log(res.data);
        setUser(res.data);
      } catch (error) {
        console.log('[UserProfile] sussy: ' + error);
      }
    };

    if (!userId) {
      return;
    }
    console.log('fetching user profile data');
    fetchUserInfo();
  }, [userId]);

  return (
    <div
      className={cn(
        'h-full w-full md:w-[340px] flex-col dark:bg-[#232428] bg-[#F2F3F5]',
        (!isUserProfileOpen ||
          type === 'channel' ||
          type === 'conversations') &&
          'md:hidden'
      )}
    >
      <div className="h-[120px] bg-[#5865f2] relative">
        {user && (
          <UserAvatar
            // src="https://utfs.io/f/f7fde577-81f8-4ca0-8414-0663410bd819-n92lk7.jpg"
            src={user.avatarUrl || ''}
            username={user.username}
            className="w-[90px] h-[90px] absolute top-[56%] left-[4%] border-[7px] border-[#232428]"
            avatarFallbackClassName="text-[32px]"
          />
        )}
      </div>
      <div className="flex flex-col bg-[#111214] rounded-md mt-14 m-4 p-3">
        <p className="text-lg text-white font-semibold">{user?.nickname}</p>
        <Separator className="bg-zinc-400 dark:bg-zinc-700 my-3 rounded-md" />
        <p className="text-[11px] text-white font-semibold uppercase mb-2">
          Discord member since
        </p>
        <p className="text-xs text-zinc-300 mb-2">
          {/* Aug 7, 2022 */}
          {user && format(new Date(user.createdAt || ''), 'MMM d, yyyy')}
        </p>
      </div>
    </div>
  );
};

export default UserProfile;
