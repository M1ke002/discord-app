"use client";

import React from 'react'
import { useState } from 'react';
import { ChannelType, MemberRole , IServerOptionalProps } from '@/utils/constants';
import TooltipActions from '../TooltipActions';
import { ChevronDown, Plus } from 'lucide-react';
import { useModal } from '@/hooks/useModal';

interface ServerCategoryProps extends IServerOptionalProps{
  label: string;
  channelType: ChannelType;
  role: MemberRole
}

//TODO: rename component to ServerCategory (more precise name?)
const ServerCategory = ({label, channelType, role}: ServerCategoryProps) => {
  const {onOpen} = useModal();

  const [rotateChevron, setRotateChevron] = useState(false);
  const handleRotate = () => setRotateChevron(!rotateChevron);
  const rotate = rotateChevron ? "rotate(-90deg)" : "rotate(0)"

  return (
    <div className='flex items-center justify-between py-2 group' onClick={handleRotate}>
      <p 
        className='flex items-center text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-200 cursor-pointer transition'
      >
        <ChevronDown 
          className='h-4 w-4 mr-1'
          style={{ transform: rotate, transition: "all 0.2s linear" }}
        />
        {label}
      </p>
      {role !== MemberRole.MEMBER && (
        <TooltipActions label='Create channel' side='top' align='center'>
          <div 
            className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'
            onClick={(e) => {
              e.stopPropagation();
              onOpen("createChannel", {categoryName: label})
            }}
          >
            <Plus className='h-4 w-4'/>
          </div>
        </TooltipActions>
      )}
    </div>
  )
}

export default ServerCategory