import { useChatQuery } from '@/hooks/useChatQuery';
import ChatItem from './ChatItem';
import ChatItemSeparator from './ChatItemSeparator';
import ChatWelcome from './ChatWelcome';
import { Fragment } from 'react';
import ChannelMessage from '@/types/ChannelMessage';
import { Loader2, ServerCrash } from 'lucide-react';
import { useChatSocket } from '@/hooks/useChatSocket';

interface ChatMessagesProps {
  type: 'channel' | 'conversation';
  apiUrl: string;
  paramKey: 'channelId' | 'conversationId';
  paramValue: string;
  chatId: string;
  serverId?: string;
  avatarUrl?: string;
  name?: string;
}

const ChatMessages = ({
  type,
  apiUrl,
  paramKey,
  paramValue,
  chatId,
  serverId,
  name,
  avatarUrl
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;
  const createMessageKey = `chat:${chatId}:new-message`;
  const updateMessageKey = `chat:${chatId}:update-message`;

  //this hook is used to listen to changes in messages and update messages in real time
  useChatSocket({ createMessageKey, updateMessageKey, queryKey });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({ queryKey, apiUrl, paramKey, paramValue, serverId });

  if (status === 'pending') {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 py-4 overflow-y-auto">
      <div className="flex-1" />
      <ChatWelcome type={type} name={name} avatarUrl={avatarUrl} />
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((page, i) => (
          <Fragment key={i}>
            {page?.messages.map((message: ChannelMessage) => (
              <ChatItem
                type={message.id === 9 ? 'continue' : 'new'}
                message={message}
                key={message.id}
              />
            ))}
          </Fragment>
        ))}

        {/* <ChatItem type="new" />
        <ChatItem type="new" />
        <ChatItem type="new" />
        <ChatItem type="new" />
        <ChatItem type="new" />
        <ChatItem type="new" />
        <ChatItem type="new" />
        <ChatItemSeparator />
        <ChatItem type="new" isReplyMessage={true} />
        <ChatItem type="continue" />
        <ChatItem type="new" />
        <ChatItemSeparator /> */}
      </div>
    </div>
  );
};

export default ChatMessages;
