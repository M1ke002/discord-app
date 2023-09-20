import { dummyServer as server } from '@/utils/constants'
import { redirect } from 'next/navigation'

interface ServerPageProps {
   params: {
    serverId: string
  }   
}

const ServerPage = async ({params}: ServerPageProps) => {

  console.log(params.serverId)

  //check if user is logged in
  //const profile = await getUserProfile()
  //if (!profile) return redirect('/')

  //find the server based on the serverId (currently using dummy data)
  //find the 'general' channel's id of the server
  const generalChannelId = server.channels.find(channel => channel.name === 'general')?.id;

  if (!generalChannelId) return null;

  return (
    redirect(`/servers/${params.serverId}/channels/${generalChannelId}`)
  )
}

export default ServerPage