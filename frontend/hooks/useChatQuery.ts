import { useInfiniteQuery } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from '@/components/providers/SocketProvider';
import useAxiosAuth from './useAxiosAuth';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { useAroundMessage } from './zustand/useSearchAroundMessage';

interface useChatQueryProps {
  messageType: 'channelMessages' | 'directMessages';
  queryKey: string;
  apiUrl: string; // /messages or /direct-messages
  serverId?: string;
  channelId?: string;
  userId1?: string;
  userId2?: string;
  setBottomMessageTracker?: any;
  setTopMessageTracker?: any;
  aroundMessageId?: string;
  messageChannelId?: string;
  setAroundMessage?: any;
}

const DEFAULT_PAGE_LIMIT = 30;

export const useChatQuery = ({
  messageType,
  queryKey,
  apiUrl,
  serverId,
  channelId,
  userId1,
  userId2,
  aroundMessageId,
  messageChannelId,
  setBottomMessageTracker,
  setTopMessageTracker,
  setAroundMessage
}: useChatQueryProps) => {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  const { isConnected } = useSocket();
  const router = useRouter();
  // const { aroundMessageId, messageChannelId, setAroundMessage } =
  //   useAroundMessage();

  const pageLimitRef = useRef(DEFAULT_PAGE_LIMIT);

  const fetchMessages = async (
    pageParam = 0,
    direction = 'forward',
    meta: Record<string, unknown> | undefined //additional data
  ) => {
    console.log('fetching messages in useChatQuery, direction: ' + direction);
    let queryString = `${apiUrl}?cursor=${pageParam}&limit=${pageLimitRef.current}&direction=${direction}`;
    if (messageType === 'channelMessages') {
      queryString += `&channelId=${channelId}&serverId=${serverId}`;
    } else if (messageType === 'directMessages') {
      queryString += `&userId1=${userId1}&userId2=${userId2}`;
    }
    console.log('queryString: ' + queryString);
    try {
      const res = await axiosAuth.get(queryString);
      return res.data;
    } catch (error) {
      console.log('fetch message error in useChatQuery: ' + error);
      return null;
    } finally {
      if (pageLimitRef.current !== DEFAULT_PAGE_LIMIT) {
        pageLimitRef.current = DEFAULT_PAGE_LIMIT;
      }
    }
  };

  const fetchMessagesAround = async (aroundMessageId: string) => {
    console.log(
      'fetching messages in useChatQuery, aroundMessageId: ' + aroundMessageId
    );
    let queryString = `${apiUrl}?cursor=${aroundMessageId}&limit=${pageLimitRef.current}&direction=around`;
    if (messageType === 'channelMessages') {
      queryString += `&channelId=${channelId}&serverId=${serverId}`;
    } else if (messageType === 'directMessages') {
      queryString += `&userId1=${userId1}&userId2=${userId2}`;
    }
    console.log('queryString: ' + queryString);
    try {
      const res = await axiosAuth.get(queryString);
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log('fetch message error in useChatQuery: ' + error);
    } finally {
      if (pageLimitRef.current !== DEFAULT_PAGE_LIMIT) {
        pageLimitRef.current = DEFAULT_PAGE_LIMIT;
      }
    }
  };

  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    status,
    refetch
  } = useInfiniteQuery({
    queryKey: [queryKey], //the cached data is stored under this key name
    queryFn: ({ pageParam, direction, meta }) => {
      if (!aroundMessageId) {
        return fetchMessages(pageParam, direction, meta);
      } else {
        if (
          (messageType === 'channelMessages' &&
            messageChannelId === channelId) ||
          messageType === 'directMessages'
        ) {
          console.log('[FETCH IN QUERYFN]');
          return fetchMessagesAround(aroundMessageId);
        }
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage) {
        return lastPage.nextCursor;
      } else {
        return null;
      }
    },
    getPreviousPageParam: (firstPage) => {
      if (firstPage) {
        return firstPage.previousCursor;
      } else {
        return null;
      }
    },
    maxPages: 2,
    refetchInterval: isConnected ? false : 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    retryOnMount: false,
    meta: {
      test: 'testvalue'
    }
  });

  const fetchNextPageWithLimit = (limit: number) => {
    pageLimitRef.current = limit;
    fetchNextPage();
  };

  useEffect(() => {
    const fetchMessagesAround = async (
      messageType: string,
      messageChannelId?: string
    ) => {
      try {
        let isMessageInCache = false;
        if (messageType === 'channelMessages' && messageChannelId) {
          //check if the message is already available in the cache of that channel
          const data: any = queryClient.getQueryData([
            queryKey.replace(/:.*/, `:${messageChannelId}`)
          ]);
          if (data) {
            data.pages.forEach((page: any) => {
              if (
                page.messages.find(
                  (message: any) => message.id.toString() === aroundMessageId
                )
              ) {
                isMessageInCache = true;
                console.log('message is in cache', data, aroundMessageId);
                return;
              }
            });
          }
        }

        if (!isMessageInCache) {
          let queryString = `${apiUrl}?cursor=${aroundMessageId}&limit=${pageLimitRef.current}&direction=around`;
          if (messageType === 'channelMessages') {
            queryString += `&channelId=${
              messageChannelId ? messageChannelId : channelId
            }&serverId=${serverId}`;
          } else if (messageType === 'directMessages') {
            queryString += `&userId1=${userId1}&userId2=${userId2}`;
          }
          console.log(queryString);
          const res = await axiosAuth.get(queryString);
          console.log(res.data);
          //replace querykey (chat:chatId) with chat:messageChannelId
          const key = !messageChannelId
            ? queryKey
            : queryKey.replace(/:.*/, `:${messageChannelId}`);
          queryClient.setQueryData([key], (oldData: any) => {
            return {
              pages: [
                {
                  messages: [...res.data.messages],
                  nextCursor: res.data.nextCursor,
                  previousCursor: res.data.previousCursor
                }
              ],
              pageParams: [0]
            };
          });
        }

        if (messageChannelId) {
          router.push(`/servers/${serverId}/channels/${messageChannelId}`);
        }
      } catch (error) {
        console.log('fetch message error in useChatQuery: ' + error);
      }
    };
    if (data && aroundMessageId) {
      console.log('[REFETCH IN USEEFFECT]');
      if (messageType === 'channelMessages') {
        //if the message is in the same channel
        if (messageChannelId === channelId) {
          fetchMessagesAround(messageType);
        } else {
          fetchMessagesAround(messageType, messageChannelId);
        }
      } else if (messageType === 'directMessages') {
        fetchMessagesAround(messageType);
      }

      //reset top message tracker
      // clearTopMessageTracker();
      setTopMessageTracker({
        currentTopMessage: null,
        prevTopMessage: null
      });
      //reset bottom message tracker
      // clearBottomMessageTracker();
      setBottomMessageTracker({
        currentBottomMessage: null,
        prevBottomMessage: null
      });
      setAroundMessage(null, null);
    }
  }, [aroundMessageId, messageChannelId, data]);

  return {
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
  };
};
