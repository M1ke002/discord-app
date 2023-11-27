'use client';
import React, { use } from 'react';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useIsMicrophoneMuted } from '@/hooks/zustand/useIsMicrophoneMuted';

import '@livekit/components-styles';
import { useMaybeRoomContext } from '@livekit/components-react';
import { CustomVideoConference } from './CustomVideoConference';

const MediaRoom = () => {
  const { muted } = useIsMicrophoneMuted();
  const room = useMaybeRoomContext();

  useEffect(() => {
    if (room && room.state === 'connected') {
      // console.log('room exists');
      if (muted && room.localParticipant.isMicrophoneEnabled) {
        room.localParticipant.setMicrophoneEnabled(false);
      } else if (!muted && !room.localParticipant.isMicrophoneEnabled) {
        room.localParticipant.setMicrophoneEnabled(true);
      }
    }
  }, [room?.state, muted]);

  // console.log(room);

  return (
    <>
      <CustomVideoConference />
    </>
  );
};

export default MediaRoom;
