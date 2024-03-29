import React from 'react';
import UserAvatar from '../UserAvatar';
import { LogOut, Mic, MicOff, Settings } from 'lucide-react';
import TooltipActions from '../TooltipActions';
import { signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useModal } from '@/hooks/zustand/useModal';
import { useSession } from 'next-auth/react';
import { useIsMicrophoneMuted } from '@/hooks/zustand/useIsMicrophoneMuted';

//TODO: change props to accept a Member object instead

const UserAccount = () => {
  const { data: session } = useSession();
  const { onOpen } = useModal();
  // const [mute, setMute] = useState(false);
  const { muted, setMuted } = useIsMicrophoneMuted();

  return (
    <div className="mt-auto flex items-center px-2 py-2 bg-[#e9ebee] dark:bg-[#252529]">
      <div className="flex items-center">
        <UserAvatar
          src={session?.user.file?.fileUrl || undefined}
          username={session?.user.nickname}
          className="md:h-8 md:w-8 mr-2"
        />
        <div className="flex flex-col">
          <p className="font-semibold text-black dark:text-white text-xs">
            {session?.user.nickname}
          </p>
          <p className="text-[10px] text-zinc-400">{session?.user.username}</p>
        </div>
      </div>
      <div className="ml-auto">
        <TooltipActions label={muted ? 'Unmute' : 'Mute'}>
          <button
            className="group hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition p-2 rounded-md"
            onClick={() => {
              setMuted(!muted);
              localStorage.setItem('muted', (!muted).toString());
            }}
          >
            {muted ? (
              <MicOff className="h-4 w-4 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
            ) : (
              <Mic className="h-4 w-4 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
            )}
          </button>
        </TooltipActions>
        <TooltipActions label="User settings" side="top" align="center">
          <button
            className="group hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition p-2 rounded-md"
            onClick={() => onOpen('userSettings')}
          >
            <Settings className="h-4 w-4 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
          </button>
        </TooltipActions>

        <TooltipActions label="log out">
          <button
            className="group hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition p-2 rounded-md"
            onClick={() => signOut()}
          >
            <LogOut className="h-4 w-4 text-rose-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
          </button>
        </TooltipActions>
      </div>
    </div>
  );
};

export default UserAccount;
