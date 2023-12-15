// import { useSocket } from '@/components/providers/SocketProvider';
import ChannelMessage from '@/types/ChannelMessage';
import DirectMessage from '@/types/DirectMessage';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import useAxiosAuth from './useAxiosAuth';
import supabase from '@/utils/supabase';

interface useChatSocketProps {
  queryKey: string;
  hasPreviousPage: boolean;
  apiUrl: string; // /messages or /direct-messages
  messageType: 'channelMessages' | 'directMessages';
  serverId?: string;
}

//migrating to supabase real time instead of socket.io
export const useRealtimeChat = ({
  queryKey,
  hasPreviousPage,
  apiUrl,
  messageType,
  serverId
}: useChatSocketProps) => {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  // const { socket } = useSocket();
  // console.log('in useChatSocket ');

  useEffect(() => {
    if (!supabase) return;

    const handleMessageChange = async (payload: any) => {
      if (payload.eventType === 'INSERT' && hasPreviousPage) {
        return;
      } else if (payload.eventType === 'DELETE') {
        const deletedMessageId = { ...payload.old }.id;
        console.log(
          'received message from supabase in DELETE: ' + deletedMessageId
        );
        queryClient.setQueryData([queryKey], (oldData: any) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return oldData;
          }

          const newPages = oldData.pages.map((page: any) => {
            let isDeletedMessageInPage = page.messages.find(
              (currMessage: ChannelMessage | DirectMessage) =>
                currMessage.id === deletedMessageId
            );
            if (!isDeletedMessageInPage) return page;
            //check if deleted message is the first or last position in the messages array
            const isFirstMessage = page.messages[0]?.id === deletedMessageId;
            const isLastMessage =
              page.messages[page.messages.length - 1]?.id === deletedMessageId;
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
                    currMessage.id !== deletedMessageId
                )
                .map((currMessage: ChannelMessage | DirectMessage) => {
                  if (
                    currMessage.hasReplyMessage &&
                    currMessage.replyToMessage &&
                    currMessage.replyToMessage.id === deletedMessageId
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
      } else {
        const messageId = { ...payload.new }.id;
        console.log(
          'received message from supabase: ' +
            messageId +
            ' ' +
            payload.eventType
        );
        //get message details
        let queryString = `${apiUrl}/${messageId}`;
        if (messageType === 'channelMessages') {
          queryString += `?serverId=${serverId}`;
        }
        console.log(queryString);
        try {
          const res = await axiosAuth.get(queryString);
          const message: ChannelMessage | DirectMessage = res.data;
          console.log('message received: ' + JSON.stringify(message));

          if (payload.eventType === 'INSERT') {
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

              console.log('newPages: ' + JSON.stringify(newPages));

              return {
                ...oldData,
                pages: newPages
              };
            });
          } else if (payload.eventType === 'UPDATE') {
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
          }
        } catch (error) {
          console.log('error in useRealtimeChat: ' + error);
        }
      }
    };

    const channel = supabase
      .channel(queryKey)
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        // console.log('received payload: ' + JSON.stringify(payload));
        handleMessageChange(payload);
      })
      .subscribe();

    //listen to create message event
    // socket.on(createMessageKey, (message: ChannelMessage | DirectMessage) => {
    //   console.log(
    //     '[createMessageKey] received message from socket: ' +
    //       JSON.stringify(message)
    //   );

    //   //if user is not at bottom of page, dont show new message
    //   if (hasPreviousPage) return;
    //   queryClient.setQueryData([queryKey], (oldData: any) => {
    //     //if no data, add new data to it
    //     if (!oldData || !oldData.pages || oldData.pages.length === 0) {
    //       return {
    //         pages: [
    //           {
    //             messages: [message]
    //           }
    //         ]
    //       };
    //     }

    //     const newPages = [...oldData.pages];
    //     //if there is data, add new message to the first page
    //     newPages[0] = {
    //       ...newPages[0],
    //       messages: [message, ...newPages[0].messages]
    //     };

    //     return {
    //       ...oldData,
    //       pages: newPages
    //     };
    //   });
    // });

    // //listen to update message event
    // socket.on(updateMessageKey, (message: ChannelMessage | DirectMessage) => {
    //   console.log(
    //     '[updateMessageKey] received message from socket: ' +
    //       JSON.stringify(message)
    //   );
    //   queryClient.setQueryData([queryKey], (oldData: any) => {
    //     if (!oldData || !oldData.pages || oldData.pages.length === 0) {
    //       return oldData;
    //     }

    //     //find the message and replace it with the new message
    //     const newPages = oldData.pages.map((page: any) => {
    //       return {
    //         ...page,
    //         messages: page.messages.map(
    //           (currMessage: ChannelMessage | DirectMessage) => {
    //             if (currMessage.id === message.id) {
    //               return message;
    //             }
    //             return currMessage;
    //           }
    //         )
    //       };
    //     });

    //     return {
    //       ...oldData,
    //       pages: newPages
    //     };
    //   });
    // });

    // //listen to delete message event
    // socket.on(deleteMessageKey, (messageId: number) => {
    //   console.log(
    //     '[deleteMessageKey] received message from socket, id: ' + messageId
    //   );
    //   queryClient.setQueryData([queryKey], (oldData: any) => {
    //     if (!oldData || !oldData.pages || oldData.pages.length === 0) {
    //       return oldData;
    //     }

    //     const newPages = oldData.pages.map((page: any) => {
    //       let isDeletedMessageInPage = page.messages.find(
    //         (currMessage: ChannelMessage | DirectMessage) =>
    //           currMessage.id === messageId
    //       );
    //       if (!isDeletedMessageInPage) return page;
    //       //check if deleted message is the first or last position in the messages array
    //       const isFirstMessage = page.messages[0]?.id === messageId;
    //       const isLastMessage =
    //         page.messages[page.messages.length - 1]?.id === messageId;
    //       //the first message(messages[0]) is the bottom displayed message -> refers to previousCursor
    //       if (
    //         page.previousCursor &&
    //         isFirstMessage &&
    //         page.messages.length > 1
    //       ) {
    //         //update previousCursor
    //         page.previousCursor = page.messages[1].id;
    //       } else if (
    //         page.nextCursor &&
    //         isLastMessage &&
    //         page.messages.length > 1
    //       ) {
    //         //update nextCursor
    //         page.nextCursor = page.messages[page.messages.length - 2].id;
    //       }

    //       return {
    //         ...page,
    //         messages: page.messages
    //           .filter(
    //             (currMessage: ChannelMessage | DirectMessage) =>
    //               currMessage.id !== messageId
    //           )
    //           .map((currMessage: ChannelMessage | DirectMessage) => {
    //             if (
    //               currMessage.hasReplyMessage &&
    //               currMessage.replyToMessage &&
    //               currMessage.replyToMessage.id === messageId
    //             ) {
    //               return {
    //                 ...currMessage,
    //                 replyToMessage: null
    //               };
    //             }
    //             return currMessage;
    //           })
    //       };
    //     });

    //     return {
    //       ...oldData,
    //       pages: newPages
    //     };
    //   });
    // });

    return () => {
      supabase.removeChannel(channel);
      // socket.off(createMessageKey);
      // socket.off(updateMessageKey);
      // socket.off(deleteMessageKey);
    };
  }, [
    queryKey,
    queryClient,
    hasPreviousPage,
    supabase,
    axiosAuth,
    apiUrl,
    messageType,
    serverId
  ]);
};
