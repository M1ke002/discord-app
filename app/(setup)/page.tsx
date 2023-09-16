import React from 'react'
import { redirect } from 'next/navigation';
import CreateServerModal from '@/components/modals/CreateInitialServerModal';

//the home page
const SetupPage = () => {
  //the user's profile (will be obtained using await getUserProfile())
    const profile = null;

    //find the user's first discord server in the server list (will be found based on the user's profile id)
    const server = {
        id: '123'
    };

    //if the user is in a server -> redirect to the server page
    if (server.id) {
        return redirect(`/servers/${server.id}`);
    }
  
    //this will be a modal to create a new server (in future will be the landing page)
    return (
        <CreateServerModal />
    )
}

export default SetupPage