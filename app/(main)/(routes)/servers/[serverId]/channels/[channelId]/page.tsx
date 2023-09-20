import React from 'react'
import { dummyServer } from '@/utils/constants'
import { redirect } from 'next/navigation'
import ChatHeader from '@/components/chat/ChatHeader'

interface ChannelIDpageProps {
  params: {
    channelId: string,
    serverId: string
  }    
}

const ChannelIDpage = ({params}: ChannelIDpageProps) => {

  //check if user logged in using profile

  //find the channel using the channelId (currently using dummy data)
  const channel = dummyServer.channels[0];

  if (!channel) {
    redirect('/');
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={channel.name}
        type='channel'
        serverId={params.serverId}
      />
    </div>
  )
}

export default ChannelIDpage