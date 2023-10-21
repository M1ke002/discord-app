'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { useForm } from 'react-hook-form';
import TooltipActions from '../TooltipActions';
import UserAvatar from '../UserAvatar';
import { getRoleIcon } from '@/utils/constants';
import { cn } from '@/lib/utils';
import { Edit, Reply, Trash } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useModal } from '@/hooks/zustand/useModal';

// const chatReplyIconClassName =
//   'before:block before:absolute before:top-[37%] before:right-[100%] before:bottom-0 before:left-[-36px] before:mt-[-1px] before:mr-[4px] before:mb-[3px] before:ml-[-1px] before:border-t-[1.6px] before:border-t-zinc-600 before:border-l-[1.6px] before:border-l-zinc-600 before:rounded-tl-[6px]';

const chatReplyIconClassName =
  'before:block before:absolute before:top-[0%] before:right-[100%] before:h-[14px] before:left-[19px] before:mt-[7px] before:mr-[-34px] before:mb-[0px] before:ml-[0px] before:border-t-[1.6px] before:border-t-zinc-600 before:border-l-[1.6px] before:border-l-zinc-600 before:rounded-tl-[6px]';

interface ChatItemProps {
  type: 'new' | 'continue';
  isReplyMessage?: boolean;
}

const formSchema = z.object({
  chatMessage: z.string().min(1)
});

const ChatItem = ({ type = 'new', isReplyMessage = false }: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { onOpen } = useModal();

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === 'Escape') {
        setIsEditing(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chatMessage: ''
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <div
      className={cn(
        'group flex flex-col items-center hover:bg-black/5 px-4 py-1 transition',
        type === 'new' && 'mt-4'
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
              {isReplyMessage && (
                <div className="h-6">
                  {/* Just a placeholder for the chat reply icon */}
                </div>
              )}
              <div className="cursor-pointer hover:drop-shadow-md">
                <UserAvatar username="John Doe" />
              </div>
            </div>
          ) : (
            <div>
              <p className="hidden group-hover:block text-zinc-400 text-[10px]">
                2:24 AM
              </p>
            </div>
          )}
        </div>

        <div
          className={cn(
            'flex flex-col w-full overflow-x-hidden',
            isReplyMessage && chatReplyIconClassName
          )}
        >
          {isReplyMessage && (
            <div className={cn('flex items-center mb-2 whitespace-nowrap')}>
              <UserAvatar
                username="John Doe"
                className="h-4 w-4"
                avatarFallbackClassName="text-[7px]"
              />
              <p className="text-xs text-zinc-400 ml-1 font-semibold hover:underline cursor-pointer">
                @John Doe
              </p>
              <p className="text-xs text-black hover:text-black/75 dark:text-zinc-400 ml-1 dark:hover:text-zinc-300 cursor-pointer">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum
              </p>
            </div>
          )}
          {type === 'new' && (
            <div className="flex items-center gap-x-2">
              <div className="flex items-center">
                <p className="font-semibold text-sm hover:underline cursor-pointer">
                  <span className="text-rose-500">John Doe</span>
                </p>
                <TooltipActions label="admin">
                  <p className="ml-1">
                    {
                      getRoleIcon('h-4 w-4')[
                        'ADMIN' as keyof typeof getRoleIcon
                      ]
                    }
                  </p>
                </TooltipActions>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-1">
                  05/12/2022 10:30 PM
                </span>
              </div>
            </div>
          )}
          {!isEditing && (
            <div className="text-black dark:text-zinc-400 text-sm">
              asd ads ad dad s s relative group flex items-center relative group
              flex items-center relative
            </div>
          )}
          {isEditing && (
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
                  onClick={() => setIsEditing(false)}
                >
                  cancel
                </span>
                , enter to save
              </span>
            </Form>
          )}
        </div>

        {/*action box to delete, edit, reply message */}
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-2 -top-4 right-3 bg-white dark:bg-[#313338] border-[1px] rounded-sm border-neutral-200 dark:border-neutral-800">
          <TooltipActions label="Reply">
            <Reply className="cursor-pointer w-4 h-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
          </TooltipActions>
          <TooltipActions label="Edit">
            <Edit
              onClick={() => setIsEditing(true)}
              className="cursor-pointer ml-auto w-4 h-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
            />
          </TooltipActions>
          <TooltipActions label="Delete">
            <Trash
              onClick={() => onOpen('deleteMessage')}
              className="cursor-pointer w-4 h-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
            />
          </TooltipActions>
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
