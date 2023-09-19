import React from 'react'
import { redirect } from 'next/navigation';
import ServerHeader from './ServerHeader';
import { ScrollArea } from '../ui/scroll-area';
import ServerSearch from './ServerSearch';
import { Hash, ShieldAlert, ShieldCheck, User2, Video, Volume2 } from 'lucide-react';


interface ServerSidebarProps {
    serverId: string;
}

//maps channel type to icon
const channelIconMap = {
  "text": <Hash className='h-4 w-4 mr-2'/>,
  "audio": <Volume2 className='h-4 w-4 mr-2'/>,
  "video": <Video className='h-4 w-4 mr-2'/>
}

const roleIconMap = {
  'Member': <User2 className='h-4 w-4 mr-2'/>,
  'Moderator': <ShieldCheck className='h-4 w-4 mr-2 text-indigo-500'/>,
  'Admin': <ShieldAlert className='h-4 w-4 mr-2 text-rose-500'/>
}

const ServerSidebar = ({serverId}: ServerSidebarProps) => {

  const profile = {
    id: '2',
    name: 'Mit',
    role: 'Member',
  }

  if (!profile) {
    return redirect('/');
  }

  //find server info from db using the serverId
  // const server = await getServer(serverId);
  const server = {
    name: 'csgo',
    channels: [
      {
        type: 'text',
        id: '1',
        name: 'general'
      },
      {
        type: 'audio',
        id: '2',
        name: 'voice chat'
      },
      {
        type: 'video',
        id: '3',
        name: 'video chat'
      },
      {
        type: 'text',
        id: '4',
        name: 'trash'
      },
    ],
    members: [
      {
        profileId: '1',
        name: 'member1',
        role: 'Moderator',
        avatarUrl: 'https://utfs.io/f/14bd6e96-89b9-4a8b-9446-d6ca74fa5949-k4kllm.jpg'
      },
      {
        profileId: '2',
        name: 'member2',
        role: 'Admin',
        avatarUrl: 'https://utfs.io/f/14bd6e96-89b9-4a8b-9446-d6ca74fa5949-k4kllm.jpg'
      },
      {
        profileId: '3',
        name: 'member3',
        role: 'Member',
        avatarUrl: 'https://utfs.io/f/14bd6e96-89b9-4a8b-9446-d6ca74fa5949-k4kllm.jpg'
      }
    ],
    inviteCode: '123abcd',
    imageUrl: 'https://utfs.io/f/14bd6e96-89b9-4a8b-9446-d6ca74fa5949-k4kllm.jpg'
    // imageUrl: null
  };

  if (!server) {
      return redirect('/');
  }

  const textChannels = server?.channels.filter(channel => channel.type === 'text');
  const audioChannels = server?.channels.filter(channel => channel.type === 'audio');
  const videoChannels = server?.channels.filter(channel => channel.type === 'video');

  //get the user's role in the server
  const member = server?.members.find(member => member.profileId === profile.id);
  const role = member?.role;

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
                  data: textChannels?.map(channel => (
                    {
                      icon: channelIconMap[channel.type as keyof typeof channelIconMap],
                      name: channel.name,
                      id: channel.id
                    }
                  ))
                },
                {
                  label: 'Audio Channels',
                  type: 'channels',
                  data: audioChannels?.map(channel => (
                    {
                      icon: channelIconMap[channel.type as keyof typeof channelIconMap],
                      name: channel.name,
                      id: channel.id
                    }
                  ))
                },
                {
                  label: 'Video Channels',
                  type: 'channels',
                  data: videoChannels?.map(channel => (
                    {
                      icon: channelIconMap[channel.type as keyof typeof channelIconMap],
                      name: channel.name,
                      id: channel.id
                    }
                  ))
                },
                {
                  label: 'Members',
                  type: 'members',
                  data: server?.members.map(member => (
                    {
                      icon: roleIconMap[member.role as keyof typeof roleIconMap],
                      name: member.name,
                      id: member.profileId
                    }
                  ))
                }
              ]
            }
          />
        </div>
      </ScrollArea>
    </div>
  )
}

export default ServerSidebar