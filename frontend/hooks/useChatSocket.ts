import { useSocket } from '@/components/providers/SocketProvider';
import ChannelMessage from '@/types/ChannelMessage';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

interface useChatSocketProps {
  createMessageKey: string;
  updateMessageKey: string;
  queryKey: string;
}

export const useChatSocket = ({
  createMessageKey,
  updateMessageKey,
  queryKey
}: useChatSocketProps) => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  // console.log('in useChatSocket ');

  useEffect(() => {
    if (!socket) return;

    //listen to create message event
    socket.on(createMessageKey, (message: ChannelMessage) => {
      console.log(
        '[createMessageKey] received message from socket: ' +
          JSON.stringify(message)
      );
      queryClient.setQueryData([queryKey], (oldData: any) => {
        //if no data, add new data to it
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [
              {
                messages: [message]
              }
            ]
          };
        }

        const newPages = [...oldData.pages];
        //if there is data, add new message to the first page
        newPages[0] = {
          ...newPages[0],
          messages: [message, ...newPages[0].messages]
        };

        return {
          ...oldData,
          pages: newPages
        };
      });
    });

    //listen to update message event
    socket.on(updateMessageKey, (message: ChannelMessage) => {
      console.log(
        '[updateMessageKey] received message from socket: ' +
          JSON.stringify(message)
      );
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData;
        }

        //find the message and replace it with the new message
        const newPages = oldData.pages.map((page: any) => {
          return {
            ...page,
            messages: page.messages.map((currMessage: ChannelMessage) => {
              if (currMessage.id === message.id) {
                return message;
              }
              return currMessage;
            })
          };
        });

        return {
          ...oldData,
          pages: newPages
        };
      });
    });

    return () => {
      socket.off(createMessageKey);
      socket.off(updateMessageKey);
    };
  }, [socket, createMessageKey, updateMessageKey, queryKey, queryClient]);
};
