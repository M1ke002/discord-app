import { Hash } from 'lucide-react';
import UserAvatar from '../UserAvatar';

interface ChatWelcomeProps {
  type: 'channel' | 'conversation';
  avatarUrl?: string;
  name?: string;
}

const ChatWelcome = ({ type, avatarUrl, name }: ChatWelcomeProps) => {
  return (
    <div className="space-y-2 px-4 mb-3">
      {type === 'channel' && (
        <div className="w-[60px] h-[60px] bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center rounded-full">
          <Hash className="h-10 w-10 text-white" />
        </div>
      )}
      {type === 'conversation' && (
        <UserAvatar
          src={avatarUrl}
          username={name}
          className="w-[65px] h-[65px]"
          avatarFallbackClassName="text-[26px]"
        />
      )}

      <p className="text-xl md:text-2xl font-bold">
        {type === 'channel' && `Welcome to #${name}`}
        {type === 'conversation' && `${name}`}
      </p>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm">
        {type === 'channel' && `This is the start of the #${name} channel.`}
        {type === 'conversation' && (
          <>
            This is the start of your direct message history with{' '}
            <span className="text-zinc-300 font-semibold">{name}</span>.
          </>
        )}
      </p>
    </div>
  );
};

export default ChatWelcome;
