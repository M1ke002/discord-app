'use client';
import React from 'react';

import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import TooltipActions from '../TooltipActions';
import useAxiosAuth from '@/hooks/useAxiosAuth';
import Channel from '@/types/Channel';

interface NavItemProps {
  id: string;
  imageUrl: string | null;
  name: string;
}

const NavItem = ({ id, imageUrl, name }: NavItemProps) => {
  const router = useRouter();
  const params = useParams();
  const axiosAuth = useAxiosAuth();

  const navigateToServer = async () => {
    try {
      console.log('getting the server...');
      const response = await axiosAuth.get(`/servers/${id}`);
      const server = response.data;

      //find the 'general' channel's id of the server
      const generalChannelId = server.channels.find(
        (channel: Channel) => channel.name === 'general'
      )?.id;
      console.log('general channel ID: ' + generalChannelId);
      if (generalChannelId) {
        // router.refresh();
        router.push(`/servers/${id}/channels/${generalChannelId}`);
      }
    } catch (error) {
      console.log('[serverId] sussy: ' + error);
    }
  };

  return (
    <TooltipActions label={name} side="right" align="center">
      <button
        onClick={() => {
          navigateToServer();
          // router.push(`/servers/${id}`);
        }}
        className="group relative flex items-center"
      >
        <div
          className={cn(
            'absolute left-0 bg-primary rounded-r-full transition-all w-[4px]',
            params?.serverId !== id && 'group-hover:h-[20px]',
            params?.serverId === id ? 'h-[36px]' : 'h-[8px]'
          )}
        />
        <div
          className={cn(
            'relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden',
            params?.serverId === id && 'text-primary rounded-[16px]',
            imageUrl === null &&
              'group-hover:bg-[#7289DA] group-hover:text-white justify-center items-center dark:bg-neutral-700 bg-white'
          )}
        >
          {imageUrl === null ? (
            <p>{name[0]}</p>
          ) : (
            <Image fill src={imageUrl} alt="Channel" />
          )}
        </div>
      </button>
    </TooltipActions>
  );
};

export default NavItem;
