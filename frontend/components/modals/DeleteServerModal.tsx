'use client';

import React, { useState } from 'react';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogFooter
} from '../ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import { Alert, AlertDescription } from '../ui/alert';
import { useModal } from '@/hooks/zustand/useModal';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { Input } from '../ui/input';
import { useToast } from '../ui/use-toast';
import useAxiosAuth from '@/hooks/useAxiosAuth';
import axios from 'axios';

const DeleteServerModal = () => {
  const { type, isOpen, onOpen, onClose, data } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const axiosAuth = useAxiosAuth();
  const router = useRouter();
  const { toast } = useToast();

  const isModalOpen = type === 'deleteServer' && isOpen;
  const { server } = data;

  const formSchema = z
    .object({
      //the server name must match the name of the input
      name: z.string()
    })
    .refine((data) => data.name === server?.name, {
      message: 'Server name does not match!: ' + server?.name,
      path: ['name']
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ''
    }
  });

  const handleCloseModal = () => {
    form.reset();
    onClose();
  };

  const deleteServer = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      setIsLoading(true);

      //if the server has a file key, delete the file from uploadthing server
      if (server?.file?.fileKey) {
        console.log('server has filekey');
        const res = await axios.delete(
          `/api/uploadthing-files?fileKey=${server?.file?.fileKey}`
        );
        if (res.data.status === 'error') {
          console.log(
            'error deleting file from uploadthing server',
            res.data.message
          );
          return;
        }
      }

      const res = await axiosAuth.delete(`/servers/${server?.id}`);
      if (res.status === 200) {
        toast({
          title: 'Server deleted successfully!'
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
    router.push('/conversations');
    setIsLoading(false);
    handleCloseModal();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-6 pb-2 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete server
          </DialogTitle>
        </DialogHeader>
        <div className="px-6 text-zinc-500">
          <Alert variant="destructive">
            <AlertDescription className="text-sm">
              Are you sure you want to delete{' '}
              {<span className="font-bold">{server?.name}</span>}? This action
              cannot be undone.
            </AlertDescription>
          </Alert>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(deleteServer)}
            className="space-y-8"
          >
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Enter server name
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
              <div className="flex items-center ml-auto">
                <Button
                  variant="ghost"
                  className="mr-2"
                  disabled={isLoading}
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  disabled={isLoading}
                  className="text-white bg-red-500 hover:bg-red-600"
                >
                  Delete server
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteServerModal;
