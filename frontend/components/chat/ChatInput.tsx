import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Plus } from 'lucide-react';
import { Input } from '../ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '../ui/form';
import useAxiosAuth from '@/hooks/useAxiosAuth';
import EmojiPicker from '../EmojiPicker';

interface ChatInputProps {
  apiUrl: string;
  channelId?: string;
  userId?: string;
  serverId?: string;
}

const formSchema = z.object({
  content: z.string().min(1)
});

const ChatInput = ({ apiUrl, channelId, userId, serverId }: ChatInputProps) => {
  const axiosAuth = useAxiosAuth();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: ''
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
      const res = await axiosAuth.post(apiUrl, {
        content: values.content,
        channelId,
        userId,
        serverId
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
    form.setValue('content', '');
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
                <div className="relative px-4 pb-6">
                  <button
                    type="button"
                    className="absolute top-3 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 rounded-full transition p-1 flex items-center justify-center"
                  >
                    <Plus className="h-4 w-4 text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    disabled={isLoading}
                    className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/50 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
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
