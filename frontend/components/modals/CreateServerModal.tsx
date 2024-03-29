'use client';

import React, { useState, useContext } from 'react';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogDescription
} from '../ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useModal } from '@/hooks/zustand/useModal';
import useAxiosAuth from '@/hooks/useAxiosAuth';
import { useToast } from '../ui/use-toast';
import { useRefetchComponents } from '@/hooks/zustand/useRefetchComponent';
import UploadFileZone from '../UploadFileZone';
import Image from 'next/image';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';

//for validation
const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Server name is required!'
  })
});

const CreateServerModal = () => {
  const { type, isOpen, onOpen, onClose, data } = useModal();
  const { triggerRefetchComponents } = useRefetchComponents();
  const axiosAuth = useAxiosAuth();
  const { toast } = useToast();
  const [imageData, setImageData] = useState<{
    src: string;
    file: File | null;
  }>({
    src: '',
    file: null
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ''
    }
  });

  const { userId } = data;
  const isModalOpen = type === 'createServer' && isOpen;

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const requestBody: any = {};
      //check if a server image is uploaded
      if (imageData.file) {
        const data = new FormData();
        data.set('file', imageData.file as any);
        //upload image to uploadthing server
        const res = await axios.post('/api/uploadthing-files', data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log(res.data);

        if (res.data.status === 'error') {
          console.log('error uploading image to uploadthing server');
          return;
        }

        requestBody.fileUrl = res.data.data.url;
        requestBody.fileKey = res.data.data.key;
        requestBody.fileName = res.data.data.name;
      }

      requestBody.userId = userId;
      requestBody.serverName = values.name;

      const res = await axiosAuth.post(`/servers`, requestBody);
      if (res.status == 200) {
        toast({
          title: 'Server created successfully!'
        });
        console.log(res.data);
        triggerRefetchComponents(['Navbar']);
      } else {
        toast({
          title: 'Something went wrong',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.log(error);
    }
    onClose();
  };

  const handleCloseModal = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Create a new server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Customize your server with a unique name and picture. You can always
            change it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div
                className={cn(
                  !imageData.file ? 'px-10' : 'flex items-center justify-center'
                )}
              >
                <div>
                  {!imageData.file ? (
                    <UploadFileZone setImageData={setImageData} />
                  ) : (
                    <div className="relative h-20 w-20">
                      <Image
                        fill
                        src={imageData.src}
                        alt="Upload"
                        className="rounded-full"
                      />
                      <button
                        onClick={() => setImageData({ src: '', file: null })}
                        className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
                        type="button"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Server name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter server name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <div className="w-full flex items-center justify-between">
                <Button
                  disabled={isLoading}
                  variant="ghost"
                  type="button"
                  onClick={() => onOpen('newServerOptions')}
                >
                  Back
                </Button>
                <Button disabled={isLoading} variant="primary">
                  Create
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateServerModal;
