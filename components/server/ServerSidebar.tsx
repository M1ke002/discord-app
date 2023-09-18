import React from 'react'
import { redirect } from 'next/navigation';
import ServerHeader from './ServerHeader';

interface ServerSidebarProps {
    serverId: string;
}

const ServerSidebar = ({serverId}: ServerSidebarProps) => {

  const profile = {
    id: '2',
    name: 'Mit',
    role: 'Admin',
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
      },
      {
        type: 'audio',
      },
      {
        type: 'video',
      }
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
    </div>
  )
}

export default ServerSidebar