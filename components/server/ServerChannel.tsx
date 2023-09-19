"use client"

import { cn } from '@/lib/utils'
import { MemberRole, IServerProps, getChannelIcon } from '@/utils/constants'
import { useParams } from 'next/navigation'
import React from 'react'

interface ServerChannelProps extends IServerProps {
    channel: {
        type: string,
        id: string,
        name: string
    },
    role?: MemberRole,
}

const ServerChannel = ({channel, role, server}: ServerChannelProps) => {
  const params = useParams();

  return (
    <button
        className={cn(
            "group px-2 py-2 rounded-md flex items-center w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
            params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
        )}
    >
        {getChannelIcon('h-5 w-5 text-zinc-500 dark:text-zinc-400 flex-shrink-0 mr-2')[channel.type as keyof typeof getChannelIcon]}
        <p 
            className={cn(
                'line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
                params?.channelId === channel.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
            )}
        >
            {channel.name}
        </p>
    </button>
  )
}

export default ServerChannel