import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Plus, X } from 'lucide-react';
import { Input } from '../ui/input';
import { useReplyToMessage } from '@/hooks/zustand/useReplyToMessage';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '../ui/form';
import { useRefetchComponents } from '@/hooks/zustand/useRefetchComponent';
import useAxiosAuth from '@/hooks/useAxiosAuth';
import axios from 'axios';
import EmojiPicker from '../EmojiPicker';
import TooltipActions from '../TooltipActions';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

interface ChatInputProps {
  apiUrl: string;
  userId: string;
  otherUserId?: string;
  channelId?: string;
  serverId?: string;
}

const formSchema = z.object({
  content: z.string()
});

const ChatInput = ({
  apiUrl,
  channelId,
  userId,
  otherUserId,
  serverId
}: ChatInputProps) => {
  const { triggerRefetchComponents } = useRefetchComponents();
  const pathName = usePathname();
  const { message: replyToMessage, setMessage } = useReplyToMessage();
  const axiosAuth = useAxiosAuth();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: ''
    }
  });
  const inputFile = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (replyToMessage) {
      setMessage(null);
    }
  }, [pathName]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isLoading) return;
    if (values.content.trim() === '' && !file) return;
    console.log(values);
    try {
      const requestBody: any = {
        content: values.content,
        replyToMessageId: replyToMessage?.id
      };
      //if there is a file, send it to uploadthing server
      if (file) {
        const formData = new FormData();
        formData.set('file', file);
        const res = await axios.post('/api/uploadthing-files', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log(res.data);

        if (res.data.status === 'error') {
          console.log('error uploading file to uploadthing server');
          return;
        }

        requestBody.fileUrl = res.data.data.url;
        requestBody.fileKey = res.data.data.key;
      }

      if (otherUserId) {
        requestBody.userId1 = userId;
        requestBody.userId2 = otherUserId;
        requestBody.senderId = userId;
      } else {
        requestBody.userId = userId;
        requestBody.channelId = channelId;
        requestBody.serverId = serverId;
      }
      const res = await axiosAuth.post(apiUrl, requestBody);
      console.log(res.data);

      if (otherUserId && res.data.newConversation) {
        //refetch the conversations sidebar
        console.log('new conversation created!');
        triggerRefetchComponents(['ConversationSidebar']);
      }
    } catch (error) {
      console.log(error);
    }
    form.setValue('content', '');
    if (replyToMessage) {
      setMessage(null);
    }
    if (file) {
      setFile(null);
    }
  };

  const onFileChange = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
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

                  {file && (
                    <div
                      className={cn(
                        'flex items-center justify-between mx-4 py-2 px-4 dark:bg-zinc-700/50 border-b-[2px] border-zinc-700',
                        !replyToMessage && 'rounded-t-md'
                      )}
                    >
                      <p className="text-xs text-zinc-400">
                        {file.name}
                        {' | '}
                        <span className="font-semibold text-zinc-300">
                          {file.size / 1000} KB
                        </span>
                      </p>
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="h-[16px] w-[16px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 rounded-full transition p-[2px] flex items-center justify-center"
                      >
                        <X className="h-5 w-5 text-white dark:text-black text-lg" />
                      </button>
                    </div>
                  )}

                  <div className="relative px-4 pb-6">
                    {!isLoading && (
                      <TooltipActions
                        label={'Upload file'}
                        side="top"
                        align="center"
                      >
                        <button
                          type="button"
                          className="absolute top-3 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 rounded-full transition p-1 flex items-center justify-center"
                        >
                          <Plus
                            className="h-4 w-4 text-white dark:text-[#313338]"
                            onClick={() => inputFile.current?.click()}
                          />
                        </button>
                      </TooltipActions>
                    )}
                    {isLoading && (
                      <Loader2 className="absolute top-3 left-8 h-[24px] w-[24px] animate-spin text-zinc-500 dark:text-zinc-400" />
                    )}
                    {/* Hiddden input field to open image and pdf file */}
                    <Input
                      type="file"
                      className="hidden"
                      ref={inputFile}
                      accept="image/*, .pdf"
                      onChange={onFileChange}
                    />
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
