"use client";

import React from 'react'
import { useRouter } from 'next/navigation';
import ServerHeader from './ServerHeader';
import { ScrollArea } from '../ui/scroll-area';
import ServerSearch from './ServerSearch';
import { Separator } from '../ui/separator';
import ServerCategory from './ServerCategory';
import { getChannelIcon, getRoleIcon } from '@/utils/constants';
import {dummyServer as server, ChannelType, MemberRole} from '@/utils/constants';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import axios from '@/lib/axiosConfig';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import ServerChannel from './ServerChannel';
import UserAccount from './UserAccount';
import Server from '@/types/Server';
import Category from '@/types/Category';
import Channel from '@/types/Channel';
import useAxiosAuth from '@/hooks/useAxiosAuth';
import { usePathname } from 'next/navigation';
import ServerSidebarSkeleton from '../skeleton/ServerSidebarSkeleton';

interface ServerSidebarProps {
    serverId: string;
}

//maps channel type to icon


const ServerSidebar = ({serverId}: ServerSidebarProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [server, setServer] = useState<Server>();
  const axiosAuth = useAxiosAuth();
  const pathName = usePathname();

  //this newPath is used as the dependecy to refetch serveInfo from backend
  const newPath = pathName.substring(0, pathName.lastIndexOf("/"));

  useEffect(() => {
    if (!session) {
      console.log('no session');
      router.replace('/login');
      return;
    }

    if (!(newPath === `/servers/${serverId}/channels`)) {
      return;
    }

    const fetchServerInfo = async () => {
      console.log('fetch data in server side bar: ' + newPath)
      try {
        const response = await axiosAuth.get(`/servers/${serverId}`);
        const server = response.data;
        //set the server's image url to null for now
        server.imageUrl = null;
        if (!server) {
          router.replace('/');
          return;
        }
        setServer(server);
      } catch (error) {
        console.log('[serverSidebar] sussy: '+error);
        return;
      }
    }
    fetchServerInfo();
  }, [newPath])

  // return <ServerSidebarSkeleton/>

  if (session && server) {
    // console.log('got server' + JSON.stringify(server));

    // const textChannels = server.channels.filter(channel => channel.type === ChannelType.TEXT);
    // const audioChannels = server.channels.filter(channel => channel.type === ChannelType.AUDIO);
    // const videoChannels = server.channels.filter(channel => channel.type === ChannelType.VIDEO);
    const categories = server.categories;

    //get the logged in user's role in the server
    const member = server.users.find(member => member.id === session.user.id);
    if (!member) {
      console.log('member not found');
      return;
    }
    const role = member.role === "ADMIN" ? MemberRole.ADMIN : MemberRole.MEMBER;

      return (
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
          <ServerHeader server={server} role={role} categories={categories} userId={session.user.id}/>
          <ScrollArea className='flex-1 px-3'>
            <div className="mt-2">
              <ServerSearch 
                data = {
                  [
                    ...categories.map((category: Category) => (
                      {
                        category: category.name,
                        type: "channels" as const,
                        items: server.channels.filter((channel: Channel) => channel.categoryId === category.id).map((channel: Channel) => (
                          {
                            icon: getChannelIcon('h-4 w-4 mr-2')[channel.type as keyof typeof getChannelIcon],
                            name: channel.name,
                            id: channel.id
                          }
                        ))
                      }
                    )),
                    {
                      category: 'Other channels',
                      type: "channels" as const,
                      items: server.channels.filter(channel => channel.categoryId === null).map((channel: Channel) => (
                        {
                          icon: getChannelIcon('h-4 w-4 mr-2')[channel.type as keyof typeof getChannelIcon],
                          name: channel.name,
                          id: channel.id
                        }
                      ))
                    },
                    {
                      category: 'Members',
                      type: "members" as const,
                      items: server?.users.map(member => (
                        {
                          // icon: roleIconMap[member.role as keyof typeof roleIconMap],
                          icon: getRoleIcon('h-4 w-4 ml-2')[member.role as keyof typeof getRoleIcon],
                          name: member.username,
                          id: member.id
                        }
                      ))
                    }
                  ]
                }
              />
            </div>

            <Separator className="bg-zinc-200 dark:bg-zinc-700 my-2 rounded-md"/>

            {/* list of channels without a category */}
            {server.channels.filter(channel => channel.categoryId === null).map((channel: Channel) => (
              <ServerChannel
                key={channel.id}
                role={role}
                channel={channel}
                server={server}
                userId={session.user.id}
                categories={categories}
              />
            ))}
            {/* list of categories and their channels */}
            {categories.map((category: Category)  => (
              <Collapsible defaultOpen={true} key={category.id}>
                <div className="mb-2">
                    <CollapsibleTrigger className='w-full'>
                        <ServerCategory
                          key={category.id}
                          category={category}
                          server={server}
                          role={role}
                          userId={session.user.id}
                        />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      {server.channels.filter((channel: Channel) => channel.categoryId === category.id).map((channel: Channel) => (
                        <ServerChannel
                          key={channel.id}
                          role={role}
                          channel={channel}
                          server={server}
                          userId={session.user.id}
                          categories={categories}
                        />
                      ))}
                    </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </ScrollArea>
          <UserAccount 
            avatarUrl={member?.avatarUrl || ""}
            username={member?.username || ""}
            nickname={member?.nickname || ""}
          />
        </div>
      )
  } else {
    return <ServerSidebarSkeleton/>
  }
}

export default ServerSidebar