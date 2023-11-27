import { setupDisconnectButton } from '@livekit/components-core';
import { ConnectionState } from 'livekit-client';
import * as React from 'react';
import { useRoomContext, useConnectionState } from '@livekit/components-react';
import type { DisconnectButtonProps } from '@livekit/components-react';

import { useRouter } from 'next/navigation';
import { useServerData } from '../zustand/useServerData';

/**
 * The `useDisconnectButton` hook is used to implement the `DisconnectButton` or your
 * custom implementation of it. It adds onClick handler to the button to disconnect
 * from the room.
 *
 * @example
 * ```tsx
 * const { buttonProps } = useDisconnectButton();
 * return <button {...buttonProps}>Disconnect</button>;
 * ```
 * @public
 */
export function useDisconnectButton(props: DisconnectButtonProps) {
  const room = useRoomContext();
  const connectionState = useConnectionState(room);
  const router = useRouter();
  const { server } = useServerData();

  const buttonProps = React.useMemo(() => {
    const { className, disconnect } = setupDisconnectButton(room);
    const mergedProps = {
      ...props,
      className,
      onClick: () => {
        disconnect(props.stopTracks ?? true);
        const generalChannelId = server?.channels?.find(
          (channel) => channel.name === 'general'
        )?.id;
        if (!server || !generalChannelId) return;
        router.push(`/servers/${server?.id}/channels/${generalChannelId}`);
      },
      disabled: connectionState === ConnectionState.Disconnected
    };
    return mergedProps;
  }, [room, props, connectionState, server]);

  return { buttonProps };
}
