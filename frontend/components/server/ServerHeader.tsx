'use client';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  FolderPlus,
  Users
} from 'lucide-react';
import { useModal } from '@/hooks/zustand/useModal';
import { MemberRole } from '@/utils/constants';
import Server from '@/types/Server';
import Category from '@/types/Category';

interface ServerHeaderProps {
  type: 'server' | 'conversation';
  server?: Server;
  role?: MemberRole;
  categories?: Category[];
  userId?: number;
}

const ServerHeader = ({
  type,
  server,
  role,
  categories,
  userId
}: ServerHeaderProps) => {
  const { onOpen } = useModal();

  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  if (type === 'conversation') {
    return (
      <div className="flex items-center w-full text-md font-semibold px-3 h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
        Conversations
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="flex items-center w-full text-md font-semibold px-3 h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
          {server?.name}
          <ChevronDown className="mr-6 md:mr-0 h-5 w-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
        <DropdownMenuItem
          onClick={() => onOpen('invite', { server, memberRole: role })}
          className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
        >
          Invite people
          <UserPlus className="h-4 w-4 ml-auto" />
          {/* ml-auto will automatically margin-left most the item */}
        </DropdownMenuItem>

        {isAdmin && (
          <DropdownMenuItem
            className="px-3 py-2 text-sm cursor-pointer"
            onClick={() =>
              onOpen('editServer', { server, userId: userId?.toString() })
            }
          >
            Server settings
            <Settings className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {isAdmin && (
          <DropdownMenuItem
            className="px-3 py-2 text-sm cursor-pointer"
            onClick={() =>
              onOpen('members', { server, userId: userId?.toString() })
            }
          >
            Manage members
            <Users className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {isModerator && (
          <DropdownMenuItem
            className="px-3 py-2 text-sm cursor-pointer"
            onClick={() =>
              onOpen('createChannel', {
                categories,
                userId: userId?.toString()
              })
            }
          >
            Create channel
            <PlusCircle className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {isModerator && (
          <DropdownMenuItem
            className="px-3 py-2 text-sm cursor-pointer"
            onClick={() =>
              onOpen('createCategory', { server, userId: userId?.toString() })
            }
          >
            Create category
            <FolderPlus className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {isModerator && <DropdownMenuSeparator />}

        {isAdmin && (
          <DropdownMenuItem
            className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
            onClick={() => onOpen('deleteServer', { server })}
          >
            Delete server
            <Trash className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {!isAdmin && (
          <DropdownMenuItem
            className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
            onClick={() =>
              onOpen('leaveServer', { server, userId: userId?.toString() })
            }
          >
            Leave server
            <LogOut className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;
