import { useChatQuery } from '@/hooks/useChatQuery';
import ChatItem from './ChatItem';
import ChatItemSeparator from './ChatItemSeparator';
import ChatWelcome from './ChatWelcome';
import { Fragment, useRef, useEffect, useState, useMemo } from 'react';
import ChannelMessage from '@/types/ChannelMessage';
import { Loader2, ServerCrash } from 'lucide-react';
import { useChatSocket } from '@/hooks/useChatSocket';
import ChatItemSkeleton from '../skeleton/ChatItemSkeleton';
import Member from '@/types/Member';
import { checkIsNewDay } from '@/utils/utils';
import User from '@/types/User';
import DirectMessage from '@/types/DirectMessage';
import InfiniteScroll from 'react-infinite-scroll-component';
import useAxiosAuth from '@/hooks/useAxiosAuth';

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
  const [clickedMessageId, setClickedMessageId] = useState('');

  const axiosAuth = useAxiosAuth();

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

  const {
    data,
    fetchNextPage,
    fetchNextPageWithLimit,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useChatQuery({
    messageType,
    queryKey,
    apiUrl,
    serverId,
    channelId,
    userId1: currUser?.id.toString(),
    userId2: otherUser?.id.toString()
  });

  //scroll to a reply message when a reply message is clicked
  useEffect(() => {
    const handleReplyMessageClick = async () => {
      try {
        if (clickedMessageId !== '') {
          const messageElement = document.getElementById(clickedMessageId);
          if (!messageElement) {
            //the message is not yet rendered -> need to fetch older messages
            let query = `${apiUrl}/count?fromMessageId=${clickedMessageId}&toMessageId=${
              messages[messages.length - 1].id
            }`;
            if (type === 'channel') {
              query += `&channelId=${channelId}`;
            } else {
              query += `&userId1=${currUser?.id}&userId2=${otherUser?.id}`;
            }
            const res = await axiosAuth.get(query);
            console.log(res.data);
            const count = res.data.response;
            if (count) fetchNextPageWithLimit(Number(count));
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    handleReplyMessageClick();
  }, [clickedMessageId]);

  //get all messages from all pages
  const messages = useMemo(
    () =>
      data?.pages.reduce((prev, page) => {
        return [...prev, ...page?.messages];
      }, [] as (ChannelMessage | DirectMessage)[]),
    [data]
  );

  if (status === 'loading') {
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
    <div
      ref={chatRef}
      className="flex flex-col-reverse flex-1 py-4 overflow-y-auto h-full"
      id="chat-messages-container"
    >
      <div ref={bottomRef} />

      <InfiniteScroll
        dataLength={messages?.length}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        className="flex flex-col-reverse"
        scrollThreshold="450px" //the height of the chatItemSkeleton div: 448px
        loader={
          <div>
            <ChatItemSkeleton variant={1} />
            <ChatItemSkeleton variant={6} />
            <ChatItemSkeleton variant={4} />
          </div>
        }
        scrollableTarget="chat-messages-container"
        inverse={true}
      >
        <div className="flex flex-col-reverse mt-auto">
          {messages?.map(
            (message: ChannelMessage | DirectMessage, index: number) => {
              //check the sender of the current message and the next message.
              const prevMessage =
                index + 1 < messages.length ? messages[index + 1] : null;
              const isSameSender = message.sender.id === prevMessage?.sender.id;

              const currMessageDate = new Date(message.createdAt);
              const prevMessageDate = new Date(prevMessage?.createdAt);
              const isLessThanFiveMinutes =
                currMessageDate.getTime() - prevMessageDate.getTime() <
                5 * 60 * 1000;
              const isContinue = isSameSender && isLessThanFiveMinutes;
              const isNewDay = checkIsNewDay(currMessageDate, prevMessageDate);

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
                    clickedMessageId={clickedMessageId}
                    setClickedMessageId={setClickedMessageId}
                  />
                  {isNewDay && <ChatItemSeparator date={message.createdAt} />}
                </Fragment>
              );
            }
          )}
        </div>
      </InfiniteScroll>

      {!hasNextPage && (
        <ChatWelcome
          type={type}
          name={chatWelcomeName}
          avatarUrl={otherUser?.file?.fileUrl || ''}
        />
      )}
      {!hasNextPage && <div className="flex-1" />}
    </div>
  );
};

export default ChatMessages;
