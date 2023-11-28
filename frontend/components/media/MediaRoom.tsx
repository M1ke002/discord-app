'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useIsMicrophoneMuted } from '@/hooks/zustand/useIsMicrophoneMuted';
import User from '@/types/User';

import '@livekit/components-styles';
import { useMaybeRoomContext } from '@livekit/components-react';
import { CustomVideoConference } from './CustomVideoConference';

type VideoCall = {
  type: 'videoCall';
  currentUser: User;
  otherUser: User;
};

type ChannelCall = {
  type: 'channelCall';
};

type MediaRoomProps = VideoCall | ChannelCall;

const MediaRoom = (mode: MediaRoomProps) => {
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
      <CustomVideoConference
        mode={mode.type}
        currentUser={mode.type === 'videoCall' ? mode.currentUser : undefined}
        otherUser={mode.type === 'videoCall' ? mode.otherUser : undefined}
      />
    </>
  );
};

export default MediaRoom;
