'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { useForm } from 'react-hook-form';
import TooltipActions from '../TooltipActions';
import UserAvatar from '../UserAvatar';
import { MemberRole, getRoleIcon } from '@/utils/constants';
import { cn } from '@/lib/utils';
import { Edit, Reply, Trash } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useModal } from '@/hooks/zustand/useModal';
import { useReplyToMessage } from '@/hooks/zustand/useReplyToMessage';
import useAxiosAuth from '@/hooks/useAxiosAuth';
import { format } from 'date-fns';
import ChannelMessage from '@/types/ChannelMessage';
import Member from '@/types/Member';

// const chatReplyIconClassName =
//   'before:block before:absolute before:top-[37%] before:right-[100%] before:bottom-0 before:left-[-36px] before:mt-[-1px] before:mr-[4px] before:mb-[3px] before:ml-[-1px] before:border-t-[1.6px] before:border-t-zinc-600 before:border-l-[1.6px] before:border-l-zinc-600 before:rounded-tl-[6px]';

const chatReplyIconClassName =
  'before:block before:absolute before:top-[0%] before:right-[100%] before:h-[14px] before:left-[19px] before:mt-[7px] before:mr-[-34px] before:mb-[0px] before:ml-[0px] before:border-t-[1.6px] before:border-t-zinc-600 before:border-l-[1.6px] before:border-l-zinc-600 before:rounded-tl-[6px]';

interface ChatItemProps {
  type: 'new' | 'continue';
  message: ChannelMessage;
  editingMessageId: string;
  setEditingMessageId: (id: string) => void;
  currMember: Member;
  userId: string;
  serverId?: string;
  channelId?: string;
}

const formSchema = z.object({
  chatMessage: z.string().min(1)
});

const ChatItem = ({
  type = 'new',
  message,
  editingMessageId,
  setEditingMessageId,
  currMember,
  userId,
  serverId,
  channelId
}: ChatItemProps) => {
  const axiosAuth = useAxiosAuth();
  const { onOpen } = useModal();
  const { message: replyToMessage, setMessage } = useReplyToMessage();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chatMessage: message.content
    }
  });

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
      const res = await axiosAuth.put(`/messages/${message.id}`, {
        content: values.chatMessage,
        userId,
        serverId,
        channelId
      });
      console.log(res.data);
    } catch (error) {
      console.log('[edit message]' + error);
    }
    setEditingMessageId('');
  };

  const isAdmin = currMember.role === MemberRole.ADMIN;
  const isModerator = currMember.role === MemberRole.MODERATOR;
  const isMessageSender = currMember.id === message.sender.id;
  const canDeleteMessage = isAdmin || isModerator || isMessageSender;
  const canEditMessage = isMessageSender;

  if (message.hasReplyMessage) type = 'new';

  return (
    <div
      className={cn(
        'group flex flex-col items-center hover:bg-black/5 px-4 py-1 transition',
        type === 'new' && 'mt-4',
        replyToMessage?.id === message.id &&
          'bg-[#393b48] hover:bg-[#393b48] border-l-2 border-blue-500'
      )}
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
                  src={message.sender.avatarUrl}
                  username={message.sender.nickname}
                />
              </div>
            </div>
          ) : (
            <div>
              <p className="hidden group-hover:block text-zinc-400 text-[10px]">
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
                  <div className="h-[18px] w-[18px] bg-black rounded-full flex items-center justify-center">
                    <Reply className="w-4 h-4 text-zinc-400" />
                  </div>
                  <p className="text-xs text-black  dark:text-zinc-400 ml-1 italic">
                    Original message was deleted
                  </p>
                </>
              )}
              {message.replyToMessage != null && (
                <>
                  <UserAvatar
                    username={message.replyToMessage?.sender.nickname}
                    className="h-4 w-4"
                    avatarFallbackClassName="text-[8px]"
                  />
                  <p className="text-xs text-zinc-400 ml-1 font-semibold hover:underline cursor-pointer">
                    {message.replyToMessage?.sender.nickname}
                  </p>
                  <p className="text-xs text-black hover:text-black/75 dark:text-zinc-400 ml-1 dark:hover:text-zinc-300 cursor-pointer">
                    {message.replyToMessage?.content}
                  </p>
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
                      message.sender.role === MemberRole.ADMIN
                        ? 'text-rose-500'
                        : message.sender.role === MemberRole.MODERATOR
                        ? 'text-indigo-500'
                        : 'text-white'
                    )}
                  >
                    {message.sender.nickname}
                  </span>
                </p>
                <TooltipActions
                  label={
                    message.sender.role === MemberRole.ADMIN
                      ? 'Admin'
                      : message.sender.role === MemberRole.MODERATOR
                      ? 'Moderator'
                      : 'Member'
                  }
                >
                  <p className="ml-1">
                    {
                      getRoleIcon('h-4 w-4')[
                        message.sender.role as keyof typeof getRoleIcon
                      ]
                    }
                  </p>
                </TooltipActions>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-1">
                  {/* 05/12/2022 10:30 PM */}
                  {format(new Date(message.createdAt), 'MM/dd/yyyy hh:mm a')}
                </span>
              </div>
            </div>
          )}
          {editingMessageId !== message.id.toString() && (
            <div className="text-black dark:text-zinc-300 text-sm">
              {message.content}
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
        </div>

        {/*action box to delete, edit, reply message */}
        {editingMessageId !== message.id.toString() && (
          <div className="hidden group-hover:flex items-center gap-x-2 absolute p-2 -top-4 right-3 bg-white dark:bg-[#313338] border-[1px] rounded-sm border-neutral-200 dark:border-neutral-800">
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
                      messageId: message.id.toString(),
                      userId,
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
