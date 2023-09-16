import React from 'react'
import { redirect } from 'next/navigation';
import NavigationAction from './NavigationAction';
import NavDirectMessages from './NavDirectMessages';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import NavItem from './NavItem';
import { ModeToggle } from '../ModeToggle';

const Navbar = async () => {
//   const profile = await getCurrentProfile()
    const profile = "fakeProfile";

    if (!profile) {
        return redirect('/');
    }

    //fake servers of the user (will be obtained by calling api)
    const servers = [
        {
            id: '123',
            name: 'dsds',
            imageUrl: 'https://utfs.io/f/14bd6e96-89b9-4a8b-9446-d6ca74fa5949-k4kllm.jpg'
        },
        {
            id: '245',
            name: 'csgo',
            imageUrl: 'https://utfs.io/f/9455970e-4afb-4fde-afa2-f4a4f7fee873-3kvko5.png'
        },
        {
            id: '2456',
            name: 'dsds',
            imageUrl: 'https://utfs.io/f/14bd6e96-89b9-4a8b-9446-d6ca74fa5949-k4kllm.jpg'
        }
    ];
  
    return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary
        w-full dark:bg-[#1E1F22] py-3"
    >
        <NavDirectMessages/>
        <Separator
            className='h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto'
        />
        <ScrollArea className='flex-1 w-full'>
            {servers.map(server => {
                return (
                    <div key={server.id} className='mb-4'>
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