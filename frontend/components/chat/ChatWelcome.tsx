import { Hash } from 'lucide-react';

const ChatWelcome = () => {
  return (
    <div className="space-y-2 px-4 mb-3">
      <div className="w-[60px] h-[60px] bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center rounded-full">
        <Hash className="h-10 w-10 text-white" />
      </div>
      <p className="text-xl md:text-2xl font-bold">Welcome to #general!</p>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm">
        This is the start of the #general channel.
      </p>
    </div>
  );
};

export default ChatWelcome;
