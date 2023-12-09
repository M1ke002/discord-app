import { useSocket } from '@/components/providers/SocketProvider';
import ChannelMessage from '@/types/ChannelMessage';
import DirectMessage from '@/types/DirectMessage';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

interface useChatSocketProps {
  createMessageKey: string;
  updateMessageKey: string;
  deleteMessageKey: string;
  queryKey: string;
  hasPreviousPage: boolean;
}

export const useChatSocket = ({
  createMessageKey,
  updateMessageKey,
  deleteMessageKey,
  queryKey,
  hasPreviousPage
}: useChatSocketProps) => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  // console.log('in useChatSocket ');

  useEffect(() => {
    if (!socket) return;

    //listen to create message event
    socket.on(createMessageKey, (message: ChannelMessage | DirectMessage) => {
      console.log(
        '[createMessageKey] received message from socket: ' +
          JSON.stringify(message)
      );

      //if user is not at bottom of page, dont show new message
      if (hasPreviousPage) return;
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
    socket.on(updateMessageKey, (message: ChannelMessage | DirectMessage) => {
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
            messages: page.messages.map(
              (currMessage: ChannelMessage | DirectMessage) => {
                if (currMessage.id === message.id) {
                  return message;
                }
                return currMessage;
              }
            )
          };
        });

        return {
          ...oldData,
          pages: newPages
        };
      });
    });

    //listen to delete message event
    socket.on(deleteMessageKey, (messageId: number) => {
      console.log(
        '[deleteMessageKey] received message from socket, id: ' + messageId
      );
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData;
        }

        const newPages = oldData.pages.map((page: any) => {
          let isDeletedMessageInPage = page.messages.find(
            (currMessage: ChannelMessage | DirectMessage) =>
              currMessage.id === messageId
          );
          if (!isDeletedMessageInPage) return page;
          //check if deleted message is the first or last position in the messages array
          const isFirstMessage = page.messages[0]?.id === messageId;
          const isLastMessage =
            page.messages[page.messages.length - 1]?.id === messageId;
          //the first message(messages[0]) is the bottom displayed message -> refers to previousCursor
          if (
            page.previousCursor &&
            isFirstMessage &&
            page.messages.length > 1
          ) {
            //update previousCursor
            page.previousCursor = page.messages[1].id;
          } else if (
            page.nextCursor &&
            isLastMessage &&
            page.messages.length > 1
          ) {
            //update nextCursor
            page.nextCursor = page.messages[page.messages.length - 2].id;
          }

          return {
            ...page,
            messages: page.messages
              .filter(
                (currMessage: ChannelMessage | DirectMessage) =>
                  currMessage.id !== messageId
              )
              .map((currMessage: ChannelMessage | DirectMessage) => {
                if (
                  currMessage.hasReplyMessage &&
                  currMessage.replyToMessage &&
                  currMessage.replyToMessage.id === messageId
                ) {
                  return {
                    ...currMessage,
                    replyToMessage: null
                  };
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
      socket.off(deleteMessageKey);
    };
  }, [
    socket,
    createMessageKey,
    updateMessageKey,
    deleteMessageKey,
    queryKey,
    queryClient,
    hasPreviousPage
  ]);
};
