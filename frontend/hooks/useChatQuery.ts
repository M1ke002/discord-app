import { useInfiniteQuery } from '@tanstack/react-query';
import { useSocket } from '@/components/providers/SocketProvider';
import useAxiosAuth from './useAxiosAuth';
import { useState, useRef } from 'react';

interface useChatQueryProps {
  messageType: 'channelMessages' | 'directMessages';
  queryKey: string;
  apiUrl: string; // /messages or /direct-messages
  serverId?: string;
  channelId?: string;
  userId1?: string;
  userId2?: string;
}

const DEFAULT_PAGE_LIMIT = 30;

export const useChatQuery = ({
  messageType,
  queryKey,
  apiUrl,
  serverId,
  channelId,
  userId1,
  userId2
}: useChatQueryProps) => {
  const axiosAuth = useAxiosAuth();
  const { isConnected } = useSocket();

  const pageLimitRef = useRef(DEFAULT_PAGE_LIMIT);

  //TODO: bug -> fetchMessages is called twice when the page is loaded
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

  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    status
  } = useInfiniteQuery({
    queryKey: [queryKey], //the cached data is stored under this key name
    queryFn: ({ pageParam, direction, meta }) =>
      fetchMessages(pageParam, direction, meta),
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
    meta: {
      test: 'testvalue'
    }
  });

  const fetchNextPageWithLimit = (limit: number) => {
    pageLimitRef.current = limit;
    fetchNextPage();
  };

  return {
    data,
    fetchNextPage,
    fetchPreviousPage,
    fetchNextPageWithLimit,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    status
  };
};
