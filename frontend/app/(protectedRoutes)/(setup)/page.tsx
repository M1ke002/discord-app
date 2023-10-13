"use client"
import React from 'react'
import { useRouter } from 'next/navigation';
import CreateServerModal from '@/components/modals/CreateInitialServerModal';
import axios from '@/lib/axiosConfig';
// import { getServerSession } from "next-auth/next"
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Channel from '@/types/Channel';
import useAxiosAuth from '@/hooks/useAxiosAuth';

//the home page
const SetupPage = () => {
    const { data: session } = useSession();
    const [servers, setServers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const axiosAuth = useAxiosAuth();

    useEffect(() => {
        if (!session) {
            console.log('no session');
            router.replace('/login');
            return;
        }

        const fetchServers = async () => {
            setIsLoading(true);
            try {
                console.log('getting servers...');
                //get all servers of the user
                // let response = await axios.get(`/servers?userId=${session.user.id}`, {
                //     headers: {
                //         Authorization: `Bearer ${session.accessToken}`,
                //     },
                // });
                let response = await axiosAuth.get(`/servers?userId=${session.user.id}`);
                // console.log(response.data);
                const servers = response.data;
                // const servers = await response.json();
                if (servers.length == 0) {
                    return;
                }

                console.log(servers);
                setServers(servers);
                //get the first server's info
                // response = await axios.get(`/servers/${servers[0].id}`, {
                //     headers: {
                //         Authorization: `Bearer ${session.accessToken}`,
                //       },
                // });
                response = await axiosAuth.get(`/servers/${servers[0].id}`);
                // console.log(response.data);
                const server = response.data;
                console.log('found server: '+JSON.stringify(server));
          
                //find the 'general' channel's id of the server
                const generalChannelId = server.channels.find((channel: Channel) => channel.name === 'general')?.id;
                console.log('general channel ID: '+generalChannelId)
                if (generalChannelId) {
                  router.push(`/servers/${server.id}/channels/${generalChannelId}`)
                }
                // router.push(`/servers/${servers[0].id}`);
                // router.push(`/servers/2/channels/4`)
            } catch (error) {
                console.log('sussy: '+error);
                return;
            }
            setIsLoading(false);
          };
      
          // Only fetch servers if the user is logged in
          if (session) {
            fetchServers();
        }
    }, []);
    
    if (!isLoading && servers.length == 0) {
        return <CreateServerModal />
    }

    return <div>LOADING...</div>


    // console.log('in SetupPage')
    // const session = await getServerSession(authOptions)
    // console.log('got server session in SetupPage')

    // if (!session) {
    //     console.log('no session');
    //     return null;
    // }


    // let server = null;
    // // find the user's first discord server in the server list (will be found based on the user's profile id)
    // try {
    //     console.log('getting servers...');
    //     const response = await axios.get(`/servers?userId=${session.user.id}`, {
    //         headers: {
    //             Authorization: `Bearer ${session.accessToken}`,
    //           },
    //     });
    //     // console.log(response.data);
    //     const servers = response.data;
    //     // const servers = await response.json();
    //     if (servers.length > 0) {
    //         console.log(servers);
    //         server = servers[0];
    //     }
    // } catch (error) {
    //     console.log('sussy: '+error);
    //     return null;
    // }

    // if (server) {
    //     console.log('redirecting to server...');
    //     return redirect(`/servers/${server.id}`);
    // }

    // return <CreateServerModal />
}

export default SetupPage