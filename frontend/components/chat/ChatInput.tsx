import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Plus, X } from 'lucide-react';
import { Input } from '../ui/input';
import { useReplyToMessage } from '@/hooks/zustand/useReplyToMessage';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '../ui/form';
import useAxiosAuth from '@/hooks/useAxiosAuth';
import EmojiPicker from '../EmojiPicker';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  apiUrl: string;
  channelId?: string;
  userId?: string;
  serverId?: string;
}

const formSchema = z.object({
  content: z.string()
});

const ChatInput = ({ apiUrl, channelId, userId, serverId }: ChatInputProps) => {
  const { message: replyToMessage, setMessage } = useReplyToMessage();
  const axiosAuth = useAxiosAuth();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: ''
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.content.trim() === '') return;
    console.log(values);
    try {
      const res = await axiosAuth.post(apiUrl, {
        content: values.content,
        channelId,
        userId,
        serverId,
        replyToMessageId: replyToMessage?.id
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
    form.setValue('content', '');
    if (replyToMessage) {
      setMessage(null);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div>
                  {replyToMessage && (
                    <div className="flex items-center justify-between mx-4 py-2 px-4 bg-[#2B2D31] rounded-t-md">
                      <p className="text-xs text-zinc-400">
                        Replying to{' '}
                        <span className="font-semibold text-zinc-300">
                          {replyToMessage.sender.nickname}
                        </span>
                      </p>
                      <button
                        type="button"
                        onClick={() => setMessage(null)}
                        className="h-[16px] w-[16px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 rounded-full transition p-[2px] flex items-center justify-center"
                      >
                        <X className="h-5 w-5 text-white dark:text-black text-lg" />
                      </button>
                    </div>
                  )}

                  <div className="relative px-4 pb-6">
                    <button
                      type="button"
                      className="absolute top-3 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 rounded-full transition p-1 flex items-center justify-center"
                    >
                      <Plus className="h-4 w-4 text-white dark:text-[#313338]" />
                    </button>
                    <Input
                      disabled={isLoading}
                      className={cn(
                        'px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/50 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200',
                        replyToMessage && 'rounded-t-none'
                      )}
                      placeholder="Message #general"
                      {...field}
                    />
                    <div className="absolute top-3 right-8">
                      <EmojiPicker
                        onChange={(emoji: string) =>
                          field.onChange(`${field.value} ${emoji}`)
                        }
                      />
                    </div>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
