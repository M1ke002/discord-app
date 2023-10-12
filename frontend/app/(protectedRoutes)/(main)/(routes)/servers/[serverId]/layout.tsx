import ServerSidebar from '@/components/server/ServerSidebar';
import React from 'react'

const ServerLayout = ({children, params}: {children: React.ReactNode, params:{serverId: string}}) => {

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