'use client';

import React, { useContext } from 'react';

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
import useAxiosAuth from '@/hooks/useAxiosAuth';
import { useToast } from '../ui/use-toast';
import { useRefetchComponents } from '@/hooks/zustand/useRefetchComponent';

//for validation
const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Server name is required!'
  }),
  image: z
    .object({
      url: z.string(),
      key: z.string()
    })
    .optional()
});

const CreateServerModal = () => {
  const { type, isOpen, onClose, data } = useModal();
  const { triggerRefetchComponents } = useRefetchComponents();
  const axiosAuth = useAxiosAuth();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      image: {
        url: '',
        key: ''
      }
    }
  });

  const { userId } = data;
  const isModalOpen = type === 'createServer' && isOpen;

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await axiosAuth.post(`/servers`, {
        userId,
        serverName: values.name,
        imageUrl: values.image?.url === '' ? null : values.image?.url,
        imageKey: values.image?.key === '' ? null : values.image?.key
      });
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
              <div className="flex items-center text-center justify-center">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="serverImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
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
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateServerModal;
