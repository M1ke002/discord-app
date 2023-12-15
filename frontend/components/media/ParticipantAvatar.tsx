import { setupParticipantName } from '@livekit/components-core';
import * as React from 'react';
import { useEnsureParticipant } from '@livekit/components-react';
import type { UseParticipantInfoOptions } from '@livekit/components-react';
import { useObservableState } from '@/hooks/media/useObservableState';
import { useServerData } from '@/hooks/zustand/useServerData';
import Member from '@/types/Member';
import UserAvatar from '../UserAvatar';
import User from '@/types/User';

/** @public */
export interface ParticipantNameProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    UseParticipantInfoOptions {
  mode: 'videoCall' | 'channelCall';
  currentUser?: User;
  otherUser?: User;
}

/**
 * The `ParticipantName` component displays the name of the participant as a string within an HTML span element.
 * If no participant name is undefined the participant identity string is displayed.
 *
 * @example
 * ```tsx
 * <ParticipantName />
 * ```
 * @public
 */
export function ParticipantAvatar({
  participant,
  mode,
  currentUser,
  otherUser,
  ...props
}: ParticipantNameProps) {
  const { server } = useServerData();
  const p = useEnsureParticipant(participant);
  const [user, setUser] = React.useState<Member | User | null>(null);

  const { className, infoObserver } = React.useMemo(() => {
    return setupParticipantName(p);
  }, [p]);

  const { identity, name } = useObservableState(infoObserver, {
    name: p.name,
    identity: p.identity,
    metadata: p.metadata
  });

  React.useEffect(() => {
    if (mode === 'videoCall') {
      if (currentUser && p.identity === currentUser.nickname) {
        setUser(currentUser);
      } else if (otherUser && p.identity === otherUser.nickname) {
        setUser(otherUser);
      }
    } else if (mode === 'channelCall') {
      if (server && p.identity) {
        console.log('name', p.identity);
        //get the user info by name
        const member = server.users.find(
          (user) => user.nickname === p.identity
        );
        if (member) {
          setUser(member);
        }
      }
    }
  }, [mode, currentUser, otherUser, server, p]);

  const mergedProps = React.useMemo(() => {
    // return mergeProps(props, { className, 'data-lk-participant-name': name });
    return { ...props, className, 'data-lk-participant-name': name };
  }, [props, className, name]);

  if (user) {
    return (
      <UserAvatar
        src={user.file?.fileUrl}
        username={user.nickname}
        className="w-20 h-20"
        avatarFallbackClassName="w-20 h-20 text-[30px]"
      />
    );
  }

  //   return <ParticipantPlaceholder />;
}
