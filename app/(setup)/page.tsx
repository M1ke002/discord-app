import React from 'react'
import { redirect } from 'next/navigation';
import CreateServerModal from '@/components/modals/CreateServerModal';

//the home page
const SetupPage = () => {
  //the user's profile
    const profile = null;

    //the user's discord server (will be found based on the user's profile id)
    const server = {
        id: null
    };

    //if the user is in a server -> redirect to the server page
    if (server.id) {
        return redirect(`/servers/${server.id}`);
    }
  
    //this will be a modal to create a new server
    return (
        <CreateServerModal />
    )
}

export default SetupPage