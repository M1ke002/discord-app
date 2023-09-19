"use client"
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from 'lucide-react';
import { useModal } from '@/hooks/useModal';

interface ServerHeaderProps {
    server: {
        name: string;
        channels: { type: string }[];
        members: { profileId: string; name: string; role: string, avatarUrl: string }[];
        inviteCode: string;
        imageUrl: string | null;
    },
    role?: string;
}

const ServerHeader = ({server, role}: ServerHeaderProps) => {

  const {onOpen} = useModal();

  const isAdmin = role === 'Admin';
  const isModerator = isAdmin || role === 'Moderator';
    
  return (
    <DropdownMenu>
        <DropdownMenuTrigger
            className='focus:outline-none'
            asChild
        >
            <button 
                className='flex items-center w-full text-md font-semibold px-3 h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition'
            >
                {server.name}
                <ChevronDown className='h-5 w-5 ml-auto'/>
            </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
            className='w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]'
        >
            {isModerator && (
                <DropdownMenuItem 
                    onClick={() => onOpen("invite", {server})}
                    className='text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer'
                >
                    Invite people
                    <UserPlus className='h-4 w-4 ml-auto'/>
                    {/* ml-auto will automatically margin-left most the item */}
                </DropdownMenuItem>
            )}

            {isAdmin && (
                <DropdownMenuItem 
                    className='px-3 py-2 text-sm cursor-pointer'
                    onClick={() => onOpen("editServer", {server})}
                >
                    Server settings
                    <Settings className='h-4 w-4 ml-auto'/>
                </DropdownMenuItem>
            )}

            {isAdmin && (
                <DropdownMenuItem 
                    className='px-3 py-2 text-sm cursor-pointer'
                    onClick={() => onOpen("members", {server})}
                >
                    Manage members
                    <Users className='h-4 w-4 ml-auto'/>
                </DropdownMenuItem>
            )}

            {isModerator && (
                <DropdownMenuItem 
                    className='px-3 py-2 text-sm cursor-pointer'
                    onClick={() => onOpen("createChannel", {server})}
                >
                    Create channel
                    <PlusCircle className='h-4 w-4 ml-auto'/>
                </DropdownMenuItem>
            )}

            {isModerator && (
                <DropdownMenuSeparator/>
            )}

            {isAdmin && (
                <DropdownMenuItem 
                    className='text-rose-500 px-3 py-2 text-sm cursor-pointer'
                    onClick={() => onOpen("deleteServer", {server})}    
                >
                    Delete server
                    <Trash className='h-4 w-4 ml-auto'/>
                </DropdownMenuItem>
            )}

            {!isAdmin && (
                <DropdownMenuItem 
                    className='text-rose-500 px-3 py-2 text-sm cursor-pointer'
                    onClick={() => onOpen("leaveServer", {server})}
                >
                    Leave server
                    <LogOut className='h-4 w-4 ml-auto'/>
                </DropdownMenuItem>
            )}
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ServerHeader