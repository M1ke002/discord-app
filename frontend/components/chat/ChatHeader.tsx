'use client';

import { Hash, UserCircle, Users } from 'lucide-react';
import React from 'react';
import MobileSidebarToggle from '../MobileSidebarToggle';
import useAxiosAuth from '@/hooks/useAxiosAuth';
import { useMemberList } from '@/hooks/zustand/useMemberList';
import { useUserProfile } from '@/hooks/zustand/useUserProfile';
import MobileMemberListToggle from '../MobileMemberListToggle';
import { useChatHeaderData } from '@/hooks/zustand/useChatHeaderData';
import TooltipActions from '../TooltipActions';
import SearchBar from '../server/Searchbar';
import { cn } from '@/lib/utils';
import UserAvatar from '../UserAvatar';

interface ChatHeaderProps {
  serverId: string;
  imageUrl?: string;
}

const ChatHeader = ({ serverId, imageUrl }: ChatHeaderProps) => {
  const axiosAuth = useAxiosAuth();
  const { isMemberListOpen, toggleMemberList } = useMemberList();
  const { isUserProfileOpen, toggleUserProfile } = useUserProfile();
  const { name, type } = useChatHeaderData();

  const testAPI = async () => {
    try {
      const res = await axiosAuth.get('/messages/test');
      console.log(res.data);
      alert(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="text-md font-semibold px-3 flex items-center justify-between min-h-[48px] border-neutral-200 dark:border-neutral-800 border-b-2">
      <div className="flex items-center">
        <MobileSidebarToggle serverId={serverId} />
        {type === 'channel' && (
          <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
        )}
        {type === 'conversation' && (
          <UserAvatar src={imageUrl} username={name} className="w-8 h-8 mr-2" />
        )}
        <p
          className="font-semibold text-md text-black dark:text-white"
          onClick={testAPI}
        >
          {name}
        </p>
      </div>
      {/*  Header actions */}
      {type === 'channel' && (
        <div className="flex items-center">
          <TooltipActions
            label={isMemberListOpen ? 'Hide member list' : 'Show member list'}
            side="bottom"
            align="center"
          >
            <Users
              className={cn(
                'hidden md:block w-5 h-5 mr-4 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition cursor-pointer',
                isMemberListOpen && 'text-zinc-600 dark:text-zinc-300'
              )}
              onClick={toggleMemberList}
            />
          </TooltipActions>
          <SearchBar />
          <MobileMemberListToggle serverId={serverId} />
        </div>
      )}
      {type === 'conversation' && (
        <div className="flex items-center">
          <TooltipActions
            label={
              isUserProfileOpen ? 'Hide user profile' : 'Show user profile'
            }
            side="bottom"
            align="center"
          >
            <UserCircle
              className={cn(
                'hidden md:block w-5 h-5 mr-4 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition cursor-pointer',
                isUserProfileOpen && 'text-zinc-600 dark:text-zinc-300'
              )}
              onClick={toggleUserProfile}
            />
          </TooltipActions>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;
