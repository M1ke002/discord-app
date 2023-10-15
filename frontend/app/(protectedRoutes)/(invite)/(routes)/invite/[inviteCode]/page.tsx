import React from 'react';
import { redirect } from 'next/navigation';

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  //   const profile = await getCurrentProfile();
  const profile = 'fakeProfile';

  if (!profile || !params.inviteCode) {
    return redirect('/');
  }

  //check if the person clicking the invite url is already a member of the server
  const existingServer = {
    id: null
  };

  //if the person is already a member of the server, redirect to the server page
  if (existingServer.id) {
    return redirect(`/servers/${existingServer?.id}`);
  }

  //update the server with the new member
  //TODO: call api to update the server with the new member
  //after that, redirect the user to the newly joined server

  //this page doesn't render anything
  return null;
};

export default InviteCodePage;
