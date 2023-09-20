import React from 'react'
import { redirect } from 'next/navigation';
import NavigationAction from './NavigationAction';
import NavDirectMessages from './NavDirectMessages';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import NavItem from './NavItem';
import { ModeToggle } from '../ModeToggle';
import {dummyServerList as servers} from '@/utils/constants';

const Navbar = async () => {
//   const profile = await getCurrentProfile()
    const profile = "fakeProfile";

    if (!profile) {
        return redirect('/');
    }

    //fake servers of the user (will be obtained by calling api)

  
    return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary
        w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3"
    >
        <NavDirectMessages/>
        <Separator
            className='my-1 h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-11 mx-auto'
        />
        <ScrollArea className='flex-1 w-full'>
            {servers.map(server => {
                return (
                    <div key={server.id} className='mb-3'>
                        <NavItem id={server.id} name={server.name} imageUrl={server.imageUrl} />
                    </div>
                )
            })}
            <NavigationAction/>
        </ScrollArea>
        <div className='mt-auto flex items-center flex-col gap-y-4'>
            <ModeToggle/>
        </div>
    </div>
  )
}

export default Navbar