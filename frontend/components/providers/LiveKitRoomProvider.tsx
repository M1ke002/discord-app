'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import '@livekit/components-styles';
import { LiveKitRoom, ControlBar } from '@livekit/components-react';
import { Loader2 } from 'lucide-react';

interface LiveKitRoomProviderProps {
  children: React.ReactNode;
  chatId: string;
  isAudio: boolean;
  isVideo: boolean;
}

const LiveKitRoomProvider = ({
  children,
  chatId,
  isAudio,
  isVideo
}: LiveKitRoomProviderProps) => {
  const { data: session } = useSession();
  const [token, setToken] = useState('');
  const [isMuted, setIsMuted] = useState<boolean | null>(null);

  useEffect(() => {
    const name = session?.user?.nickname;
    const mute = localStorage.getItem('muted') === 'true';
    setIsMuted(mute);
    if (!name || !chatId) return;
    (async () => {
      try {
        const resp = await fetch(
          `/api/livekit?room=${chatId}&username=${name}`
        );
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [session?.user?.nickname, chatId]);

  if (token === '' || isMuted === null) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading media room...
        </p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={isVideo}
      audio={isMuted ? false : true}
      connect={true}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      // Use the default LiveKit theme for nice styles.
      data-lk-theme="default"
    >
      {children}
    </LiveKitRoom>
  );
};

export default LiveKitRoomProvider;
