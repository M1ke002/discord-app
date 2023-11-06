'use client';

import { Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '../ui/command';
import { useParams, useRouter } from 'next/navigation';
import UserAvatar from '../UserAvatar';

interface SidebarSearchProps {
  sidebarType: 'server' | 'conversation';
  serverData?: {
    category: string;
    type: 'channels' | 'members';
    items: {
      icon: React.ReactNode;
      name: string;
      id: number;
      avatarUrl?: string;
    }[];
  }[];
  conversationData?: {
    items: {
      name: string;
      id: number;
      avatarUrl: string;
    }[];
  };
}

const SidebarSearch = ({
  sidebarType,
  serverData,
  conversationData
}: SidebarSearchProps) => {
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState(false);

  //for keyboard shortcut ctrl+k
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const navigatePageOrConversation = (
    type: 'channels' | 'members',
    id: number
  ) => {
    setOpen(false);
    if (type === 'channels') {
      router.push(`/servers/${params?.serverId}/channels/${id}`);
    } else {
      router.push(`/conversations/${id}`);
    }
  };

  return (
    <div>
      <button
        className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
          Search
        </p>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
          <span className="text-xs">CTRL</span>k
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder={
            sidebarType === 'server'
              ? 'Search all channels and members'
              : 'Search all conversations'
          }
        />
        <CommandList>
          <CommandEmpty>No results found</CommandEmpty>
          {sidebarType === 'server' &&
            serverData &&
            serverData.map(({ category, type, items }) => {
              if (items?.length === 0) return null;
              return (
                <CommandGroup key={category} heading={category}>
                  {items?.map(({ icon, name, id, avatarUrl }) => {
                    return (
                      <CommandItem
                        key={id}
                        onSelect={() => navigatePageOrConversation(type, id)}
                      >
                        {type === 'channels' && (
                          <>
                            {icon}
                            <span>{name}</span>
                          </>
                        )}
                        {type === 'members' && (
                          <>
                            <UserAvatar
                              src={avatarUrl}
                              username={name}
                              className="w-[24px] h-[24px] mr-2"
                              avatarFallbackClassName="text-[12px]"
                            />
                            <span>{name}</span>
                            {icon}
                          </>
                        )}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              );
            })}

          {sidebarType === 'conversation' && conversationData && (
            <CommandGroup heading="Conversations">
              {conversationData?.items?.map(({ name, id, avatarUrl }) => {
                return (
                  <CommandItem
                    key={id}
                    onSelect={() => navigatePageOrConversation('members', id)}
                  >
                    <UserAvatar
                      src={avatarUrl}
                      username={name}
                      className="w-[24px] h-[24px] mr-2"
                      avatarFallbackClassName="text-[12px]"
                    />
                    <span>{name}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </div>
  );
};

export default SidebarSearch;
