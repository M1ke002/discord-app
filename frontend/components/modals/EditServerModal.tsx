'use client';

import React, { useEffect, useState } from 'react';

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
import FileUpload from '../FileUpload';
import { useModal } from '@/hooks/zustand/useModal';
import { useToast } from '../ui/use-toast';
import useAxiosAuth from '@/hooks/useAxiosAuth';
import { useRefetchComponents } from '@/hooks/zustand/useRefetchComponent';
import Image from 'next/image';
import UploadFileZone from '../UploadFileZone';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { set } from 'date-fns';
import axios from 'axios';

//for validation
const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Server name is required!'
  })
});

const EditServerModal = () => {
  const { type, isOpen, onClose, data } = useModal();
  const axiosAuth = useAxiosAuth();
  const { toast } = useToast();
  const { triggerRefetchComponents } = useRefetchComponents();
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

  const { server, userId } = data;
  const isModalOpen = type === 'editServer' && isOpen;
  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (server) {
      form.setValue('name', server.name);
      if (server.file?.fileUrl) {
        setImageData({
          src: server.file?.fileUrl,
          file: null
        });
      } else {
        setImageData({
          src: '',
          file: null
        });
      }
    }
  }, [server, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    const requestBody: any = {};
    try {
      //check if the server image is changed
      if (server?.file?.fileUrl !== imageData.src) {
        //if the server already has an existing image, delete it from uploadthing server
        if (server?.file?.fileUrl) {
          const res = await axios.delete(
            `/api/uploadthing-files?fileKey=${server.file.fileKey}`
          );
          if (res.data.status === 'error') {
            console.log(
              'error deleting image from uploadthing server',
              res.data.message
            );
            return;
          }

          requestBody.fileUrl = null;
          requestBody.fileKey = null;
          requestBody.fileName = null;
        }

        //check if user uploaded a new image
        if (imageData.src) {
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
      }

      //if the requestBody doesnt have the fileUrl property, set it to the current server's fileUrl
      if (!requestBody.hasOwnProperty('fileUrl')) {
        requestBody.fileUrl = server?.file?.fileUrl;
        requestBody.fileKey = server?.file?.fileKey;
      }

      requestBody.userId = userId;
      requestBody.serverId = server?.id;
      requestBody.serverName = values.name;

      const res = await axiosAuth.put(`/servers/${server?.id}`, requestBody);
      if (res.status === 200) {
        toast({
          title: 'Server updated successfully!'
        });
        console.log(res.data);
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
    triggerRefetchComponents(['Navbar', 'ServerSidebar']);
  };

  const handleCloseModal = () => {
    // form.reset();
    //reset the form to the initial server values
    if (server) {
      form.setValue('name', server.name);
      if (server.file?.fileUrl) {
        setImageData({
          src: server.file?.fileUrl,
          file: null
        });
      } else {
        setImageData({
          src: '',
          file: null
        });
      }
    }
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Edit server
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div
                className={cn(
                  !imageData.src ? 'px-10' : 'flex items-center justify-center'
                )}
              >
                <div>
                  {!imageData.src ? (
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
                  {/* <FileUpload
                          endpoint="serverImage"
                          value={field.value}
                          onChange={field.onChange}
                        /> */}
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
              <Button disabled={isLoading} variant="primary">
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditServerModal;
