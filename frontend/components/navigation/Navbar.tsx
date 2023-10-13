"use client"

import React from 'react'
import { useRouter } from 'next/navigation';
import axios from '@/lib/axiosConfig';
import NavigationAction from './NavigationAction';
import NavDirectMessages from './NavDirectMessages';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import NavItem from './NavItem';
import { ModeToggle } from '../ModeToggle';
import {dummyServerList} from '@/utils/constants';
// import { getServerSession } from "next-auth/next"
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Server from '@/types/Server';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import useAxiosAuth from '@/hooks/useAxiosAuth';

const Navbar = () => {
    const { data: session } = useSession();
    const [servers, setServers] = useState([]);
    const [loading, setLoading] = useState(true);
    const axiosAuth = useAxiosAuth();
    const router = useRouter();

    useEffect(() => {
        if (!session) {
            console.log('no session');
            router.replace('/login');
            return;
        }

        const fetchServers = async () => {
            setLoading(true);
            //fake servers of the user (will be obtained by calling api)
            console.log('getting servers in navbar...');
            try {
                const response = await axiosAuth.get(`/servers?userId=${session.user.id}`);
                // console.log(response.data);
                const servers = response.data;
                setServers(servers);
                console.log('[navBar] servers: '+ servers);
            } catch (error) {
                console.log('[navBar] sussy: '+error);
                return;
            }
            setLoading(false);
        }

        if (session) {
            fetchServers();
        }

    }, [])

    // if (loading) {
    //     return <div>Loading...</div>;
    // }
  
    return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary
        w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3"
    >
        <NavDirectMessages/>
        <Separator
            className='my-1 h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-11 mx-auto'
        />
        <ScrollArea className='flex-1 w-full'>
            {servers.map((server: Server) => {
                return (
                    <div key={server.id} className='mb-3'>
                        <NavItem id={String(server.id)} name={server.name} imageUrl={null} />
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