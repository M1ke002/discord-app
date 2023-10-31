'use client';

import { cn } from '@/lib/utils';
import { MemberRole, getChannelIcon } from '@/utils/constants';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import TooltipActions from '../TooltipActions';
import { Edit, Lock, Trash } from 'lucide-react';
import { ModalType, useModal } from '@/hooks/zustand/useModal';
import Server from '@/types/Server';
import Channel from '@/types/Channel';
import Category from '@/types/Category';

interface ServerChannelProps {
  server: Server;
  channel: Channel;
  categories: Category[];
  role?: MemberRole;
  userId: number;
}

const ServerChannel = ({
  channel,
  role,
  server,
  categories,
  userId
}: ServerChannelProps) => {
  const params = useParams();
  const router = useRouter();
  const { onOpen } = useModal();

  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    onOpen(action, { server, channel, userId: userId.toString(), categories });
  };

  return (
    <button
      className={cn(
        'group px-2 py-2 rounded-md flex items-center w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
        params?.channelId === channel.id.toString() &&
          'bg-zinc-700/20 dark:bg-zinc-700'
      )}
      onClick={() =>
        router.push(`/servers/${params?.serverId}/channels/${channel.id}`)
      }
    >
      {
        getChannelIcon(
          'h-5 w-5 text-zinc-500 dark:text-zinc-400 flex-shrink-0 mr-2'
        )[channel.type as keyof typeof getChannelIcon]
      }
      <p
        className={cn(
          'line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
          params?.channelId === channel.id.toString() &&
            'text-primary dark:text-zinc-200 dark:group-hover:text-white'
        )}
      >
        {channel.name}
      </p>
      {channel.name !== 'general' && role !== MemberRole.MEMBER && (
        <div className="ml-auto flex items-center gap-x-2">
          <TooltipActions label="edit">
            <Edit
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              onClick={(e) => onAction(e, 'editChannel')}
            />
          </TooltipActions>
          <TooltipActions label="delete">
            <Trash
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              onClick={(e) => onAction(e, 'deleteChannel')}
            />
          </TooltipActions>
        </div>
      )}
      {channel.name === 'general' && (
        <Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400" />
      )}
    </button>
  );
};

export default ServerChannel;
