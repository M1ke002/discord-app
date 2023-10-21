import React from 'react';
import UserAvatar from '../UserAvatar';
import { LogOut, Mic, MicOff, Settings } from 'lucide-react';
import TooltipActions from '../TooltipActions';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

//TODO: change props to accept a Member object instead
interface UserAccountProps {
  avatarUrl: string;
  username: string;
  nickname: string;
}

const UserAccount = ({ avatarUrl, username, nickname }: UserAccountProps) => {
  const [mute, setMute] = useState(false);
  return (
    <div className="mt-auto flex items-center px-2 py-2 bg-[#e9ebee] dark:bg-[#252529]">
      <div className="flex items-center">
        <UserAvatar
          src={avatarUrl}
          username={username}
          className="md:h-8 md:w-8 mr-2"
        />
        <div className="flex flex-col">
          <p className="font-semibold text-black dark:text-white text-xs">
            {nickname}
          </p>
          <p className="text-[10px] text-zinc-400">{username}</p>
        </div>
      </div>
      <div className="ml-auto">
        <TooltipActions label={mute ? 'Unmute' : 'Mute'}>
          <button
            className="group hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition p-2 rounded-md"
            onClick={() => setMute((prevState) => !prevState)}
          >
            {mute ? (
              <MicOff className="h-4 w-4 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
            ) : (
              <Mic className="h-4 w-4 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
            )}
          </button>
        </TooltipActions>
        <TooltipActions label="User settings" side="top" align="center">
          <button className="group hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition p-2 rounded-md">
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
