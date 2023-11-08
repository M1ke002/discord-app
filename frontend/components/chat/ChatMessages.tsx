import { useChatQuery } from '@/hooks/useChatQuery';
import ChatItem from './ChatItem';
import ChatItemSeparator from './ChatItemSeparator';
import ChatWelcome from './ChatWelcome';
import { Fragment, useRef, useEffect, useState } from 'react';
import ChannelMessage from '@/types/ChannelMessage';
import { Loader2, ServerCrash } from 'lucide-react';
import { useChatSocket } from '@/hooks/useChatSocket';
import ChatItemSkeleton from '../skeleton/ChatItemSkeleton';
import { useInView } from 'react-intersection-observer';
import Member from '@/types/Member';
import { checkIsNewDay } from '@/utils/utils';
import User from '@/types/User';
import DirectMessage from '@/types/DirectMessage';

interface ChatMessagesProps {
  type: 'channel' | 'conversation';
  apiUrl: string;
  chatWelcomeName: string;
  currUser: User | Member;
  otherUser?: User;
  serverId?: string;
  channelId?: string;
}

const ChatMessages = ({
  type,
  apiUrl,
  chatWelcomeName,
  currUser,
  otherUser,
  serverId,
  channelId
}: ChatMessagesProps) => {
  const chatId =
    type === 'channel' ? channelId : `${currUser.id}-${otherUser?.id}`;
  const queryKey =
    type === 'channel' ? `chat:${chatId}` : `chat-direct-message:${chatId}`;
  const createMessageKey = `chat:${chatId}:new-message`;
  const updateMessageKey = `chat:${chatId}:update-message`;
  const deleteMessageKey = `chat:${chatId}:delete-message`;

  const [editingMessageId, setEditingMessageId] = useState('');
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  //this hook is used to listen to changes in messages and update messages in real time
  useChatSocket({
    createMessageKey,
    updateMessageKey,
    deleteMessageKey,
    queryKey
  });

  const messageType = type === 'channel' ? 'channelMessages' : 'directMessages';

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      messageType,
      queryKey,
      apiUrl,
      serverId,
      channelId,
      userId1: currUser?.id.toString(),
      userId2: otherUser?.id.toString()
    });

  const { ref } = useInView({
    threshold: 0,
    onChange: (inView, entry) => {
      if (inView && !isFetchingNextPage && hasNextPage) {
        console.log('fetching next page.....');
        fetchNextPage();
      }
    }
    // triggerOnce: true
  });

  //scroll to bottom when page is first loaded
  useEffect(() => {
    if (bottomRef.current && data && !hasScrolledToBottom) {
      console.log('scrolling to bottom...');

      bottomRef.current?.scrollIntoView({
        behavior: 'instant'
      });
      setHasScrolledToBottom(true);
    }
  }, [bottomRef, data, hasScrolledToBottom]);

  if (status === 'pending') {
    console.log('loading messages...');
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
    <div ref={chatRef} className="flex flex-col flex-1 py-4 overflow-y-auto">
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && (
        <ChatWelcome
          type={type}
          name={chatWelcomeName}
          avatarUrl={otherUser?.file?.fileUrl || ''}
        />
      )}

      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((page, i) => (
          <Fragment key={i}>
            {page?.messages.map(
              (message: ChannelMessage | DirectMessage, index: number) => {
                //check the sender of the current message and the next message.
                //If next message is not found (null) maybe it is the end of this page -> check the first message of the next page
                const prevMessage =
                  page?.messages[index + 1] || data?.pages[i + 1]?.messages[0];
                const isSameSender =
                  message.sender.id === prevMessage?.sender.id;

                const currMessageDate = new Date(message.createdAt);
                const prevMessageDate = new Date(prevMessage?.createdAt);
                const isLessThanFiveMinutes =
                  currMessageDate.getTime() - prevMessageDate.getTime() <
                  5 * 60 * 1000;
                const isContinue = isSameSender && isLessThanFiveMinutes;
                const isNewDay = checkIsNewDay(
                  currMessageDate,
                  prevMessageDate
                );
                // console.log(
                //   `message: ${index} ${
                //     message.content
                //   }, curr time: ${currMessageDate.getTime()} prev time: ${prevMessageDate.getTime()}`
                // );
                return (
                  <Fragment key={index}>
                    <ChatItem
                      type={isContinue ? 'continue' : 'new'}
                      message={message}
                      editingMessageId={editingMessageId}
                      setEditingMessageId={setEditingMessageId}
                      currUser={currUser}
                      otherUser={otherUser}
                      apiUrl={apiUrl}
                      serverId={serverId}
                      channelId={channelId}
                    />
                    {isNewDay && <ChatItemSeparator date={message.createdAt} />}
                  </Fragment>
                );
              }
            )}
          </Fragment>
        ))}
        {hasNextPage && (
          <div ref={ref}>
            <ChatItemSkeleton variant={1} />
            <ChatItemSkeleton variant={2} />
            <ChatItemSkeleton variant={3} />
            <ChatItemSkeleton variant={4} />
            <ChatItemSkeleton variant={5} />
            <ChatItemSkeleton variant={6} />
            <ChatItemSkeleton variant={7} />
            <ChatItemSkeleton variant={8} />
            <ChatItemSkeleton variant={2} />
            <ChatItemSkeleton variant={5} />
          </div>
        )}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
