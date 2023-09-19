"use client";

import React from 'react'
import { ChannelType, MemberRole , IServerOptionalProps } from '@/utils/constants';
import TooltipActions from '../TooltipActions';
import { Plus } from 'lucide-react';
import { useModal } from '@/hooks/useModal';

interface ServerActionProps extends IServerOptionalProps{
  label: string;
  channelType: ChannelType;
  role: MemberRole
}

//TODO: rename component to ServerCategory (more precise name?)
const ServerSection = ({label, channelType, role}: ServerActionProps) => {
  const {onOpen} = useModal();

  return (
    <div className='flex items-center justify-between py-2'>
      <p className='text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400'>{label}</p>
      {role !== MemberRole.MEMBER && (
        <TooltipActions label='Create channel' side='top' align='center'>
          <button 
            className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'
            onClick={() => onOpen("createChannel")}
          >
            <Plus className='h-4 w-4'/>
          </button>
        </TooltipActions>
      )}
    </div>
  )
}

export default ServerSection