'use client';

import { cn } from '@/lib/utils';
import { useParams, useRouter } from 'next/navigation';
import UserAvatar from '../UserAvatar';

interface ConversationItemProps {
  id: string;
  name: string;
  avatarUrl: string;
}

const ConversationItem = ({ id, name, avatarUrl }: ConversationItemProps) => {
  const params = useParams();
  const router = useRouter();
  return (
    <button
      className={cn(
        'group p-2 rounded-md flex items-center w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
        params.userId === id && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}
      onClick={() => router.push(`/conversations/${id}`)}
    >
      <UserAvatar
        src={avatarUrl}
        username={name}
        className="h-7 w-7"
        avatarFallbackClassName="text-[13px]"
      />

      <p
        className={cn(
          'ml-2 line-clamp-1 text-sm text-black group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
          params.userId === id &&
            'text-primary dark:text-zinc-200 dark:group-hover:text-white'
        )}
      >
        {name}
      </p>
    </button>
  );
};

export default ConversationItem;
