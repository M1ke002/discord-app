"use client";

import React from 'react'
import { useState, useEffect } from 'react';
import CreateServerModal from '../modals/CreateServerModal'
import InviteModal from '../modals/InviteModal';
import EditServerModal from '../modals/EditServerModal';
import ManageMembersModal from '../modals/ManageMembersModal';
import CreateChannelModal from '../modals/CreateChannelModal';

//this component will be used to render all the modals
const ModalProvider = () => {
    //to prevent hydration errors
    //this error is caused by the fact that part of the modal is rendered on the server and part of it is rendered on the client
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;
    return (
    <>
        <CreateServerModal />
        <InviteModal />
        <EditServerModal />
        <ManageMembersModal/>
        <CreateChannelModal />
    </>
  )
}

export default ModalProvider