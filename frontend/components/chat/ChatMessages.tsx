import { useChatQuery } from '@/hooks/useChatQuery';
import { useQueryClient } from '@tanstack/react-query';
import ChatItem from './ChatItem';
import ChatItemSeparator from './ChatItemSeparator';
import ChatWelcome from './ChatWelcome';
import { Fragment, useRef, useEffect, useState, useMemo } from 'react';
import ChannelMessage from '@/types/ChannelMessage';
import { Loader2, ServerCrash } from 'lucide-react';
import { useChatSocket } from '@/hooks/useChatSocket';
import ChatItemSkeleton from '../skeleton/ChatItemSkeleton';
import Member from '@/types/Member';
import { checkIsNewDay, isChannelMessage } from '@/utils/utils';
import User from '@/types/User';
import DirectMessage from '@/types/DirectMessage';
import InfiniteScroll from 'react-infinite-scroll-component';
import InfiniteChatScroll from './InfiniteChatScroll';
import useAxiosAuth from '@/hooks/useAxiosAuth';
import { useInView } from 'react-intersection-observer';
import { useClickedMessage } from '@/hooks/zustand/useClickedMessage';
import { useMessageTracker } from '@/hooks/zustand/useMessageTracker';
import { useAroundMessage } from '@/hooks/zustand/useSearchAroundMessage';

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

  const { aroundMessageId, messageChannelId, setAroundMessage } =
    useAroundMessage();

  const [editingMessageId, setEditingMessageId] = useState('');
  const [topMessageTracker, setTopMessageTracker] = useState<{
    currentTopMessage: ChannelMessage | DirectMessage | null;
    prevTopMessage: ChannelMessage | DirectMessage | null;
  }>({
    currentTopMessage: null,
    prevTopMessage: null
  });
  const [bottomMessageTracker, setBottomMessageTracker] = useState<{
    currentBottomMessage: ChannelMessage | DirectMessage | null;
    prevBottomMessage: ChannelMessage | DirectMessage | null;
  }>({
    currentBottomMessage: null,
    prevBottomMessage: null
  });
  // const {
  //   topMessageTracker,
  //   setTopMessageTracker,
  //   bottomMessageTracker,
  //   setBottomMessageTracker,
  //   clearTopMessageTracker,
  //   clearBottomMessageTracker
  // } = useMessageTracker();
  const [hasScrolledToBottomMessage, setHasScrolledToBottomMessage] =
    useState(false);
  const { clickedMessage, setClickedMessage } = useClickedMessage();

  const axiosAuth = useAxiosAuth();

  const [bottomMessageRef, bottomMessageInView, bottomMessageEntry] = useInView(
    { threshold: 0 }
  );
  const [topMessageRef, topMessageInView, topMessageEntry] = useInView({
    threshold: 0
  });
  const [bottomElementRef, bottomElementInView, bottomElementEntry] = useInView(
    { threshold: 0 }
  );
  const [topElementRef, topElementInView, topElementEntry] = useInView({
    threshold: 0
  });

  const messageType = type === 'channel' ? 'channelMessages' : 'directMessages';

  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    fetchNextPageWithLimit,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    status,
    refetch
  } = useChatQuery({
    messageType,
    queryKey,
    apiUrl,
    serverId,
    channelId,
    userId1: currUser?.id.toString(),
    userId2: otherUser?.id.toString(),
    aroundMessageId: aroundMessageId || undefined,
    messageChannelId: messageChannelId || undefined,
    setAroundMessage,
    setTopMessageTracker,
    setBottomMessageTracker
  });

  //this hook is used to listen to changes in messages and update messages in real time
  useChatSocket({
    createMessageKey,
    updateMessageKey,
    deleteMessageKey,
    queryKey,
    hasPreviousPage
  });

  //for scrolling up -> current top message id must be less than previous top message id (older message)
  useEffect(() => {
    if (
      !topMessageTracker.currentTopMessage ||
      !topMessageTracker.prevTopMessage
    )
      return;

    if (
      topMessageTracker.currentTopMessage.id >
      topMessageTracker.prevTopMessage.id
    )
      return;
    console.log(
      'current top message id: ',
      topMessageTracker.currentTopMessage.content,
      'prev top message id: ',
      topMessageTracker.prevTopMessage.content
    );
    console.log(
      'scrolling to top message',
      topMessageTracker.prevTopMessage.content
    );
    const messageElement = document.getElementById(
      topMessageTracker.prevTopMessage.id.toString()
    );
    if (messageElement) {
      console.log('found element', messageElement);
      // messageElement.scrollIntoView({
      //   behavior: 'instant',
      //   block: 'start'
      // });
      console.log(messageElement.offsetTop);
      //scroll to just above the message
      document.getElementById('chat-messages-container')?.scrollTo({
        top: messageElement.offsetTop - 48 - 100, //48 is height of chat header, 100 is additional offset
        behavior: 'instant'
      });
    }
  }, [topMessageTracker]);

  //for scrolling down -> current bottom message id must be greater than previous bottom message id (newer message)
  useEffect(() => {
    if (
      !bottomMessageTracker.currentBottomMessage ||
      !bottomMessageTracker.prevBottomMessage
    )
      return;

    if (
      bottomMessageTracker.currentBottomMessage.id <
      bottomMessageTracker.prevBottomMessage.id
    ) {
      console.log(
        'current bottom message id is less than prev bottom message',
        bottomMessageTracker.currentBottomMessage.content,
        bottomMessageTracker.prevBottomMessage.content
      );
      return;
    }

    console.log(
      'current bottom message id: ',
      bottomMessageTracker.currentBottomMessage.content,
      'prev bottom message id: ',
      bottomMessageTracker.prevBottomMessage.content
    );
    console.log(
      'scrolling to bottom message',
      bottomMessageTracker.prevBottomMessage.content
    );
    const messageElement = document.getElementById(
      bottomMessageTracker.prevBottomMessage.id.toString()
    );
    if (messageElement) {
      console.log('found element', messageElement);
      // messageElement.scrollIntoView({
      //   behavior: 'instant',
      //   block: 'end'
      // });

      //scroll to just below the message
      document.getElementById('chat-messages-container')?.scrollTo({
        top: messageElement.offsetTop - window.innerHeight + 200,
        behavior: 'instant'
      });
    }
  }, [bottomMessageTracker]);

  useEffect(() => {
    if (data) {
      if (
        clickedMessage &&
        isChannelMessage(clickedMessage) &&
        clickedMessage.channelId.toString() === channelId
      ) {
        //scroll to the clicked message
        console.log('scrolling to clicked message...', clickedMessage.content);
        const messageElement = document.getElementById(
          clickedMessage.id.toString()
        );

        if (messageElement) {
          console.log('found clicked message element', messageElement);
          //check if messageElement is in view
          const chatMessageContainer = document.getElementById(
            'chat-messages-container'
          );
          const isInView =
            messageElement.offsetTop >= chatMessageContainer?.scrollTop! &&
            messageElement.offsetTop <=
              chatMessageContainer?.scrollTop! + window.innerHeight;
          const behavior = isInView ? 'smooth' : 'instant';
          messageElement.scrollIntoView({
            block: 'center',
            behavior: behavior
          });
          setHasScrolledToBottomMessage(true);
          setTimeout(() => {
            setClickedMessage(null);
          }, 600);
        }
      } else if (!hasScrolledToBottomMessage) {
        if (!hasPreviousPage) {
          setHasScrolledToBottomMessage(true);
          return;
        }
        console.log('scrolling to bottom message...');
        const bottomMessageElement = document.getElementById(
          data.pages[0].messages[0].id
        );
        if (bottomMessageElement) {
          bottomMessageElement.scrollIntoView({
            block: 'end',
            behavior: 'instant'
          });
        }
        setHasScrolledToBottomMessage(true);
      }
    }
  }, [data, hasPreviousPage, clickedMessage, channelId]);

  //get all messages from all pages
  const messages = useMemo(
    () =>
      data?.pages.reduce((prev, page) => {
        if (page) {
          return [...prev, ...page.messages];
        } else {
          return [...prev];
        }
      }, [] as (ChannelMessage | DirectMessage)[]),
    [data]
  );

  console.log(data);

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
    <div
      className="flex flex-col-reverse flex-1 py-4 overflow-y-auto h-full"
      id="chat-messages-container"
    >
      <InfiniteChatScroll
        getNext={fetchNextPage}
        getPrev={fetchPreviousPage}
        hasNext={!!hasNextPage}
        hasPrev={!!hasPreviousPage}
        isAtTop={topElementInView}
        isAtBottom={bottomElementInView}
        topChild={topElementEntry?.target}
        bottomChild={bottomElementEntry?.target}
        loader={
          <div>
            <ChatItemSkeleton variant={1} />
            {/* <ChatItemSkeleton variant={6} />
            <ChatItemSkeleton variant={4} /> */}
          </div>
        }
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

              const isTopMessage = prevMessage ? false : true;
              const isBottomMessage = message.id === messages[0].id;

              return (
                <Fragment key={index}>
                  {isBottomMessage && hasPreviousPage && (
                    <div ref={bottomElementRef} className="mt-1">
                      <ChatItemSkeleton variant={1} />
                      <ChatItemSkeleton variant={6} />
                      <ChatItemSkeleton variant={4} />
                    </div>
                  )}

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
                    isTopMessage={isTopMessage}
                    isBottomMessage={isBottomMessage}
                    setBottomMessageTracker={setBottomMessageTracker}
                    setTopMessageTracker={setTopMessageTracker}
                  />

                  {isNewDay && <ChatItemSeparator date={message.createdAt} />}
                  {isTopMessage && hasNextPage && (
                    <div ref={topElementRef}>
                      <ChatItemSkeleton variant={1} />
                      <ChatItemSkeleton variant={6} />
                      <ChatItemSkeleton variant={4} />
                    </div>
                  )}
                </Fragment>
              );
            }
          )}
        </div>
      </InfiniteChatScroll>

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
