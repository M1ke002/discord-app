'use client';
//import the discord-wumpus.svg in the public folder
import DiscordWumpus from '@/public/discord-wumpus.svg';

import { useEffect } from 'react';
import { useChatHeaderData } from '@/hooks/zustand/useChatHeaderData';
import Image from 'next/image';

const ConversationsPage = () => {
  const { setChatHeaderData } = useChatHeaderData();
  useEffect(() => {
    setChatHeaderData('Start a conversation', 'conversations');
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <Image
        src={DiscordWumpus}
        alt="discord wumpus"
        width={400}
        height={400}
      />
      <p className="font-semibold text-zinc-500 dark:text-zinc-400 mt-8">
        Start a conversation with a friend!
      </p>
    </div>
  );
};

export default ConversationsPage;
