'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import CreateServerModal from '../modals/CreateServerModal';
import InviteModal from '../modals/InviteModal';
import EditServerModal from '../modals/EditServerModal';
import ManageMembersModal from '../modals/ManageMembersModal';
import CreateChannelModal from '../modals/CreateChannelModal';
import LeaveServerModal from '../modals/LeaveServerModal';
import DeleteServerModal from '../modals/DeleteServerModal';
import DeleteChannelModal from '../modals/DeleteChannelModal';
import EditChannelModal from '../modals/EditChannelModal';
import CreateCategoryModal from '../modals/CreateCategoryModal';
import EditCategoryModal from '../modals/EditCategoryModal';
import DeleteCategoryModal from '../modals/DeleteCategoryModal';
import DeleteMessageModal from '../modals/DeleteMessageModal';
import UserSettingsModal from '../modals/UserSettingsModal';
import NewServerOptionsModal from '../modals/NewServerOptionsModal';
import JoinServerModal from '../modals/JoinServerModal';

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
      <NewServerOptionsModal />
      <JoinServerModal />
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <ManageMembersModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <DeleteChannelModal />
      <EditChannelModal />
      <CreateCategoryModal />
      <EditCategoryModal />
      <DeleteCategoryModal />
      <DeleteMessageModal />
      <UserSettingsModal />
    </>
  );
};

export default ModalProvider;
