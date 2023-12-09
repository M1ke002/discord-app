'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { useForm } from 'react-hook-form';
import TooltipActions from '../TooltipActions';
import UserAvatar from '../UserAvatar';
import { MemberRole, getRoleIcon } from '@/utils/constants';
import { extractLinkInContent } from '@/utils/utils';
import { cn } from '@/lib/utils';
import { Edit, FileIcon, FileImage, Reply, Trash } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useModal } from '@/hooks/zustand/useModal';
import { useReplyToMessage } from '@/hooks/zustand/useReplyToMessage';
import { useClickedMessage } from '@/hooks/zustand/useClickedMessage';
import useAxiosAuth from '@/hooks/useAxiosAuth';
import { format } from 'date-fns';
import ChannelMessage from '@/types/ChannelMessage';
import DirectMessage from '@/types/DirectMessage';
import Member from '@/types/Member';
import User from '@/types/User';
import { isChannelMessage, isServerMember } from '@/utils/utils';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { useMessageTracker } from '@/hooks/zustand/useMessageTracker';
import { useAroundMessage } from '@/hooks/zustand/useSearchAroundMessage';

// const chatReplyIconClassName =
//   'before:block before:absolute before:top-[37%] before:right-[100%] before:bottom-0 before:left-[-36px] before:mt-[-1px] before:mr-[4px] before:mb-[3px] before:ml-[-1px] before:border-t-[1.6px] before:border-t-zinc-600 before:border-l-[1.6px] before:border-l-zinc-600 before:rounded-tl-[6px]';

const chatReplyIconClassName =
  'before:block before:absolute before:top-[0%] before:right-[100%] before:h-[14px] before:left-[19px] before:mt-[7px] before:mr-[-34px] before:mb-[0px] before:ml-[0px] before:border-t-[1.6px] before:border-t-zinc-300 dark:before:border-t-zinc-600 before:border-l-[1.6px] before:border-l-zinc-300 dark:before:border-l-zinc-600 before:rounded-tl-[6px]';

interface ChatItemProps {
  type: 'new' | 'continue';
  message: ChannelMessage | DirectMessage;
  editingMessageId: string;
  setEditingMessageId: (id: string) => void;
  currUser: User | Member;
  otherUser?: User;
  apiUrl: string;
  serverId?: string;
  channelId?: string;
  isTopMessage?: boolean;
  isBottomMessage?: boolean;
  setTopMessageTracker?: any;
  setBottomMessageTracker?: any;
}

const formSchema = z.object({
  chatMessage: z.string().min(1)
});

const ChatItem = ({
  type = 'new',
  message,
  editingMessageId,
  setEditingMessageId,
  currUser,
  otherUser,
  apiUrl,
  serverId,
  channelId,
  isTopMessage,
  isBottomMessage,
  setTopMessageTracker,
  setBottomMessageTracker
}: ChatItemProps) => {
  const axiosAuth = useAxiosAuth();
  const { onOpen } = useModal();
  const { message: replyToMessage, setMessage } = useReplyToMessage();
  const { clickedMessage, setClickedMessage } = useClickedMessage();
  const { setAroundMessage } = useAroundMessage();

  const [messageRef, inView, entry] = useInView({
    threshold: 0
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chatMessage: message.content
    }
  });

  useEffect(() => {
    if (isTopMessage && setTopMessageTracker) {
      console.log('setting top message id', message.content);
      //set top message tracker using the previous state
      setTopMessageTracker((prevState: any) => ({
        ...prevState,
        prevTopMessage: prevState.currentTopMessage,
        currentTopMessage: message
      }));
    } else if (isBottomMessage && setBottomMessageTracker) {
      console.log('setting bottom message id', message.content);
      //set bottom message tracker using the previous state
      setBottomMessageTracker((prevState: any) => ({
        ...prevState,
        prevBottomMessage: prevState.currentBottomMessage,
        currentBottomMessage: message
      }));
    }
  }, [
    message,
    isBottomMessage,
    isTopMessage,
    setTopMessageTracker,
    setBottomMessageTracker
  ]);

  // useEffect(() => {
  //   if (
  //     message.id.toString() === topMessageTracker?.prevTopMessageId &&
  //     !isTopMessage
  //   ) {
  //     console.log('scrolling to top message', message.content);
  //     const messageElement = document.getElementById(message.id.toString());
  //     if (messageElement) {
  //       console.log('found element', messageElement);
  //       messageElement.scrollIntoView({
  //         behavior: 'instant',
  //         block: 'nearest'
  //       });
  //     }
  //   }
  // }, [topMessageTracker?.prevTopMessageId, message]);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === 'Escape') {
        resetForm();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [message]);

  useEffect(() => {
    form.reset({
      chatMessage: message.content
    });
  }, [message]);

  // useEffect(() => {
  //   if (clickedMessageId === message.id.toString()) {
  //     const behavior = inView ? 'smooth' : 'instant';
  //     entry?.target.scrollIntoView({
  //       behavior: behavior,
  //       block: 'center'
  //     });
  //     setTimeout(() => {
  //       setClickedMessageId('');
  //     }, 600);
  //   }
  // }, [clickedMessageId, inView, entry]);

  const resetForm = () => {
    setEditingMessageId('');
    form.reset({
      chatMessage: message.content
    });
  };

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
      const requestBody: any = {
        content: values.chatMessage
      };
      if (otherUser) {
        requestBody.userId1 = currUser?.id;
        requestBody.userId2 = otherUser?.id;
        requestBody.senderId = currUser?.id;
      } else {
        requestBody.userId = currUser?.id;
        requestBody.channelId = channelId;
        requestBody.serverId = serverId;
      }
      const res = await axiosAuth.put(`${apiUrl}/${message.id}`, requestBody);
      console.log(res.data);
    } catch (error) {
      console.log('[edit message]' + error);
    }
    setEditingMessageId('');
  };

  const fileExtension = message.file?.fileUrl?.split('.').pop();
  const isImageFile =
    fileExtension === 'png' ||
    fileExtension === 'jpg' ||
    fileExtension === 'jpeg';
  const isPDFFile = fileExtension === 'pdf';

  const isMessageSender = currUser?.id === message.sender.id;
  const isAdmin =
    isServerMember(currUser) && currUser?.role === MemberRole.ADMIN;
  const isModerator =
    isServerMember(currUser) && currUser?.role === MemberRole.MODERATOR;
  const canDeleteMessage = isMessageSender || isAdmin || isModerator;
  const canEditMessage = isMessageSender;

  if (message.hasReplyMessage) type = 'new';

  return (
    <div
      className={cn(
        'group flex flex-col items-center hover:bg-black/5 px-4 py-1 transition',
        type === 'new' && 'mt-4',
        (replyToMessage?.id === message.id ||
          clickedMessage?.id.toString() === message.id.toString()) &&
          'bg-[#f4f5ff] dark:bg-[#393b48] hover:bg-[#f4f5ff] dark:hover:bg-[#393b48] transition',
        replyToMessage?.id === message.id && 'border-l-2 border-blue-500'
      )}
      ref={messageRef}
      id={message.id.toString()}
    >
      <div
        className={cn(
          'flex gap-x-2 w-full relative',
          type === 'new' ? 'items-start' : 'items-center'
        )}
      >
        <div className="min-w-[48px]">
          {type === 'new' ? (
            <div>
              {message.hasReplyMessage && (
                <div className="h-6">
                  {/* Just a placeholder for the chat reply icon */}
                </div>
              )}
              <div className="cursor-pointer hover:drop-shadow-md">
                <UserAvatar
                  src={message.sender.file?.fileUrl || ''}
                  username={message.sender.nickname}
                />
              </div>
            </div>
          ) : (
            <div>
              <p className="hidden group-hover:block text-black dark:text-zinc-400 text-[10px]">
                {/* 2:24 AM */}
                {format(new Date(message.createdAt), 'hh:mm a')}
              </p>
            </div>
          )}
        </div>

        <div
          className={cn(
            'flex flex-col w-full overflow-x-hidden',
            message.hasReplyMessage && chatReplyIconClassName
          )}
        >
          {message.hasReplyMessage && (
            <div className={cn('flex items-center mb-2 whitespace-nowrap')}>
              {message.replyToMessage == null && (
                <>
                  <div className="h-[18px] w-[18px] bg-zinc-300 dark:bg-black rounded-full flex items-center justify-center">
                    <Reply className="w-4 h-4 text-black dark:text-zinc-400" />
                  </div>
                  <p className="text-xs text-black  dark:text-zinc-400 ml-1 italic">
                    Original message was deleted
                  </p>
                </>
              )}
              {message.replyToMessage != null && (
                <>
                  <UserAvatar
                    src={message.replyToMessage.sender.file?.fileUrl || ''}
                    username={message.replyToMessage.sender.nickname}
                    className="h-4 w-4"
                    avatarFallbackClassName="text-[8px]"
                  />
                  <p className="text-xs text-zinc-400 ml-1 font-semibold hover:underline cursor-pointer">
                    {message.replyToMessage.sender.nickname}
                  </p>
                  <p
                    className={cn(
                      'text-xs text-black hover:text-black/75 dark:text-zinc-400 dark:hover:text-zinc-300 ml-1 cursor-pointer',
                      message.replyToMessage.content === '' && 'italic'
                    )}
                    onClick={() => {
                      if (message.replyToMessage) {
                        setClickedMessage(message.replyToMessage);
                        //check if the replyToMessage html element is rendered
                        const replyToMessageElement = document.getElementById(
                          message.replyToMessage.id.toString()
                        );
                        if (!replyToMessageElement) {
                          if (isChannelMessage(message)) {
                            setAroundMessage(
                              message.replyToMessage.id.toString(),
                              message.channelId.toString()
                            );
                          } else {
                            setAroundMessage(
                              message.replyToMessage.id.toString(),
                              null
                            );
                          }
                        }
                      }
                    }}
                  >
                    {message.replyToMessage.content === '' &&
                      'Click to see attachment'}
                    {message.replyToMessage.content !== '' &&
                      extractLinkInContent(message.replyToMessage.content).map(
                        (item, index) => {
                          if (item.type === 'text') {
                            return <span key={index}>{item.text}</span>;
                          } else {
                            return (
                              <a
                                key={index}
                                href={item.text}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline dark:text-blue-400"
                              >
                                {item.text}
                              </a>
                            );
                          }
                        }
                      )}
                  </p>
                  {message.replyToMessage.file != null && (
                    <FileImage className="w-4 h-4 ml-1 text-zinc-300" />
                  )}
                </>
              )}
            </div>
          )}
          {type === 'new' && (
            <div className="flex items-center gap-x-2">
              <div className="flex items-center">
                <p className="font-semibold text-sm hover:underline cursor-pointer">
                  <span
                    className={cn(
                      isChannelMessage(message) &&
                        message.sender.role === MemberRole.ADMIN
                        ? 'text-rose-500'
                        : isChannelMessage(message) &&
                          message.sender.role === MemberRole.MODERATOR
                        ? 'text-indigo-500'
                        : 'text-black dark:text-white'
                    )}
                  >
                    {message.sender.nickname}
                  </span>
                </p>
                <TooltipActions
                  label={
                    isChannelMessage(message) &&
                    message.sender.role === MemberRole.ADMIN
                      ? 'Admin'
                      : isChannelMessage(message) &&
                        message.sender.role === MemberRole.MODERATOR
                      ? 'Moderator'
                      : 'Member'
                  }
                >
                  <p className="ml-1">
                    {isChannelMessage(message) &&
                      getRoleIcon('h-4 w-4')[
                        message.sender.role as keyof typeof getRoleIcon
                      ]}
                  </p>
                </TooltipActions>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-1">
                  {/* 05/12/2022 10:30 PM */}
                  {format(new Date(message.createdAt), 'MM/dd/yyyy') ===
                  format(new Date(), 'MM/dd/yyyy')
                    ? `Today at ${format(
                        new Date(message.createdAt),
                        'hh:mm a'
                      )}`
                    : format(new Date(message.createdAt), 'MM/dd/yyyy hh:mm a')}
                </span>
              </div>
            </div>
          )}
          {editingMessageId !== message.id.toString() && (
            <div className="text-black dark:text-zinc-300 text-sm">
              {extractLinkInContent(message.content).map((item, index) => {
                if (item.type === 'text') {
                  return <span key={index}>{item.text}</span>;
                } else {
                  return (
                    <a
                      key={index}
                      href={item.text}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline dark:text-blue-400"
                    >
                      {item.text}
                    </a>
                  );
                }
              })}
              {message.updatedAt != null && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </div>
          )}
          {editingMessageId === message.id.toString() && (
            <Form {...form}>
              <form
                className="flex items-center gap-x-2 pt-2"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="chatMessage"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                          placeholder="Edit message"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} size="sm" variant="primary">
                  Save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                Press escape to{' '}
                <span
                  className="cursor-pointer hover:underline text-blue-500"
                  onClick={() => resetForm()}
                >
                  cancel
                </span>
                , enter to save
              </span>
            </Form>
          )}

          {isImageFile && (
            <a
              href={message.file?.fileUrl || undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
            >
              <Image
                src={message.file?.fileUrl || ''}
                alt={message.content}
                fill
                sizes="100%"
                className="object-cover"
              />
            </a>
          )}

          {isPDFFile && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-zinc-200/30 dark:bg-background/10 border w-64">
              <FileIcon className="w-10 h-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={message.file?.fileUrl || undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                {message.file?.fileName}
              </a>
            </div>
          )}
        </div>

        {/*action box to delete, edit, reply message */}
        {editingMessageId !== message.id.toString() && (
          <div className="hidden group-hover:flex items-center gap-x-2 absolute p-2 -top-4 right-3 bg-white dark:bg-[color:var(--primary-dark)] border-[1px] rounded-sm border-neutral-200 dark:border-neutral-800">
            <TooltipActions label="Reply">
              <Reply
                onClick={() => setMessage(message)}
                className="cursor-pointer w-4 h-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              />
            </TooltipActions>
            {canEditMessage && (
              <TooltipActions label="Edit">
                <Edit
                  onClick={() => setEditingMessageId(message.id.toString())}
                  className="cursor-pointer ml-auto w-4 h-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                />
              </TooltipActions>
            )}
            {canDeleteMessage && (
              <TooltipActions label="Delete">
                <Trash
                  onClick={() =>
                    onOpen('deleteMessage', {
                      messageType: isChannelMessage(message)
                        ? 'channelMessage'
                        : 'directMessage',
                      messageId: message.id.toString(),
                      fileKey: message.file?.fileKey || undefined,
                      userId: currUser?.id.toString() || '',
                      otherUserId: otherUser?.id.toString() || '',
                      channelId,
                      serverId
                    })
                  }
                  className="cursor-pointer w-4 h-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                />
              </TooltipActions>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatItem;
