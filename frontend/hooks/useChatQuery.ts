import { useInfiniteQuery } from '@tanstack/react-query';
import { useSocket } from '@/components/providers/SocketProvider';
import useAxiosAuth from './useAxiosAuth';

interface useChatQueryProps {
  messageType: 'channelMessages' | 'directMessages';
  queryKey: string;
  apiUrl: string; // /messages or /direct-messages
  serverId?: string;
  channelId?: string;
  userId1?: string;
  userId2?: string;
}

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
  // console.log('in useChatQuery ');

  //TODO: bug -> fetchMessages is called twice when the page is loaded
  const fetchMessages = async (pageParam: number) => {
    console.log('fetching messages in useChatQuery');
    let queryString = `${apiUrl}?page=${pageParam}`;
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
    }
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey], //the cached data is stored under this key name
      queryFn: ({ pageParam }) => fetchMessages(pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        if (lastPage) {
          return lastPage.nextPage;
        } else {
          return null;
        }
      },
      refetchInterval: isConnected ? false : 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false
    });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  };
};
