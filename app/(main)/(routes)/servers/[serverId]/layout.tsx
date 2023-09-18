import ServerSidebar from '@/components/server/ServerSidebar';
import { redirect } from 'next/navigation';
import React from 'react'

const ServerLayout = ({children, params}: {children: React.ReactNode, params:{serverId: string}}) => {
    // const profile = await getProfile();
    const profile = "fakeProfile";

    //if the user is not logged in, redirect them to the login page
    if (!profile) {
        return redirect('/');
    }

    //find server info from db using the params obtained from the url
    // const server = await getServer(params.serverId, profile.id);
    const server = {};

    if (!server) {
        return redirect('/');
    }


  return (
    <div className="h-full">
        <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0 bg-black">
            {/* server channels sidebar */}
            <ServerSidebar serverId={params.serverId}/>
        </div>
        <main className='h-full md:pl-60'>
        {children}
        </main>
    </div>
  )
}

export default ServerLayout