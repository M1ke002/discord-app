import * as React from 'react';
// import { useDisconnectButton } from '@livekit/components-react';
import { useDisconnectButton } from '@/hooks/media/useDisconnectButton';

/** @public */
export interface DisconnectButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  stopTracks?: boolean;
  mode: 'videoCall' | 'channelCall';
}

/**
 * The `DisconnectButton` is a basic html button with the added ability to disconnect from a LiveKit room.
 * Normally this is the big red button that allows end users to leave the video or audio call.
 *
 * @example
 * ```tsx
 * <LiveKitRoom>
 *   <DisconnectButton>Leave room</DisconnectButton>
 * </LiveKitRoom>
 * ```
 * @public
 */
export function CustomDisconnectButton(props: DisconnectButtonProps) {
  const { buttonProps } = useDisconnectButton(props);
  return <button {...buttonProps}>{props.children}</button>;
}
