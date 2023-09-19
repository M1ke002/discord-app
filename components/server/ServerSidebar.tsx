import React from 'react'
import { redirect } from 'next/navigation';
import ServerHeader from './ServerHeader';
import { ScrollArea } from '../ui/scroll-area';
import ServerSearch from './ServerSearch';
import { Separator } from '../ui/separator';
import ServerSection from './ServerSection';
import { getChannelIcon, getRoleIcon } from '@/utils/constants';
import {dummyServer as server, ChannelType, MemberRole} from '@/utils/constants';
import ServerChannel from './ServerChannel';

interface ServerSidebarProps {
    serverId: string;
}

//maps channel type to icon


const ServerSidebar = ({serverId}: ServerSidebarProps) => {

  const profile = {
    id: '2',
  }

  if (!profile) {
    return redirect('/');
  }

  //find server info from db using the serverId
  // const server = await getServer(serverId);
  //currently using dummy server from utils/constants.tsx
 

  if (!server) {
      return redirect('/');
  }

  const textChannels = server?.channels.filter(channel => channel.type === ChannelType.TEXT);
  const audioChannels = server?.channels.filter(channel => channel.type === ChannelType.AUDIO);
  const videoChannels = server?.channels.filter(channel => channel.type === ChannelType.VIDEO);

  //get the logged in user's role in the server
  const member = server?.members.find(member => member.profileId === profile.id);
  // const role = member?.role;
  const role = MemberRole.ADMIN;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role}/>
      <ScrollArea className='flex-1 px-3'>
        <div className="mt-2">
          <ServerSearch 
            data = {
              [
                {
                  label: 'Text Channels',
                  type: 'channels',
                  items: textChannels?.map(channel => (
                    {
                      // icon: channelIconMap[channel.type as keyof typeof channelIconMap],
                      icon: getChannelIcon('h-4 w-4 mr-2')[channel.type as keyof typeof getChannelIcon],
                      name: channel.name,
                      id: channel.id
                    }
                  ))
                },
                {
                  label: 'Audio Channels',
                  type: 'channels',
                  items: audioChannels?.map(channel => (
                    {
                      icon: getChannelIcon('h-4 w-4 mr-2')[channel.type as keyof typeof getChannelIcon],
                      name: channel.name,
                      id: channel.id
                    }
                  ))
                },
                {
                  label: 'Video Channels',
                  type: 'channels',
                  items: videoChannels?.map(channel => (
                    {
                      icon: getChannelIcon('h-4 w-4 mr-2')[channel.type as keyof typeof getChannelIcon],
                      name: channel.name,
                      id: channel.id
                    }
                  ))
                },
                {
                  label: 'Members',
                  type: 'members',
                  items: server?.members.map(member => (
                    {
                      // icon: roleIconMap[member.role as keyof typeof roleIconMap],
                      icon: getRoleIcon('h-4 w-4 ml-2')[member.role as keyof typeof getRoleIcon],
                      name: member.name,
                      id: member.profileId
                    }
                  ))
                }
              ]
            }
          />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 my-2 rounded-md"/>
        {textChannels && (
          <div className="mb-2">
            <ServerSection
              label='Text channels'
              channelType={ChannelType.TEXT}
              server={server}
              role={role}
            />
            {textChannels.map(channel => (
              <ServerChannel
                key={channel.id}
                role={role}
                channel={channel}
                server={server}
              />
            ))}
          </div>
        )}
        {audioChannels && (
          <div className="mb-2">
            <ServerSection
              label='Audio channels'
              channelType={ChannelType.AUDIO}
              server={server}
              role={role}
            />
            {audioChannels.map(channel => (
              <ServerChannel
                key={channel.id}
                role={role}
                channel={channel}
                server={server}
              />
            ))}
          </div>
        )}
        {videoChannels && (
          <div className="mb-2">
            <ServerSection
              label='Video channels'
              channelType={ChannelType.VIDEO}
              server={server}
              role={role}
            />
            {videoChannels.map(channel => (
              <ServerChannel
                key={channel.id}
                role={role}
                channel={channel}
                server={server}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

export default ServerSidebar