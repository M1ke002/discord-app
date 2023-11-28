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
import { useModal } from '@/hooks/zustand/useModal';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '../ui/use-toast';
import useAxiosAuth from '@/hooks/useAxiosAuth';
import { useRefetchComponents } from '@/hooks/zustand/useRefetchComponent';

//for validation
const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Category name is required!'
  })
});

const CreateCategoryModal = () => {
  const { type, isOpen, onClose, data } = useModal();
  const router = useRouter();
  const params = useParams();
  const axiosAuth = useAxiosAuth();
  const { toast } = useToast();
  const { server, userId } = data;
  const { triggerRefetchComponents } = useRefetchComponents();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ''
    }
  });

  const isModalOpen = type === 'createCategory' && isOpen;

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await axiosAuth.post('/categories', {
      userId,
      serverId: server?.id,
      name: values.name.toLowerCase()
    });
    if (res.status === 200) {
      toast({
        title: 'New category created!'
      });
      console.log(res.data);
    } else {
      toast({
        title: 'Something went wrong',
        variant: 'destructive'
      });
    }
    handleCloseModal();
    //to refetch the new data from backend
    // router.push(`/servers/${params?.serverId}`);
    triggerRefetchComponents(['ServerSidebar']);
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
            Create Category
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Category name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="category-name"
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
                Create Category
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryModal;
