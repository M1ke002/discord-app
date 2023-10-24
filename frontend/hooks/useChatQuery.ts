import { useInfiniteQuery } from '@tanstack/react-query';
import { useSocket } from '@/components/providers/SocketProvider';
import useAxiosAuth from './useAxiosAuth';

interface useChatQueryProps {
  queryKey: string;
  apiUrl: string; // /messages or /conversations
  paramKey: 'channelId' | 'conversationId';
  paramValue: string;
  serverId?: string;
}

export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
  serverId
}: useChatQueryProps) => {
  const axiosAuth = useAxiosAuth();
  const { isConnected } = useSocket();

  //TODO: bug -> fetchMessages is called twice when the page is loaded
  const fetchMessages = async (pageParam: number) => {
    console.log('fetching messages in useChatQuery');
    let queryString = `${apiUrl}?page=${pageParam}&${paramKey}=${paramValue}`;
    if (serverId) {
      queryString += `&serverId=${serverId}`;
    }
    try {
      const res = await axiosAuth.get(queryString);
      return res.data;
    } catch (error) {
      console.log('fetch message error in useChatQuery: ' + error);
      return null;
    }
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: ({ pageParam }) => fetchMessages(pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage?.nextPage,
      refetchInterval: isConnected ? false : 1000,
      refetchOnWindowFocus: false
    });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  };
};
