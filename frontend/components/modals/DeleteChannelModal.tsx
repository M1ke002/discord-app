'use client';

import React, { useState } from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogFooter
} from '../ui/dialog';
import { useModal } from '@/hooks/zustand/useModal';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import useAxiosAuth from '@/hooks/useAxiosAuth';
import { useToast } from '../ui/use-toast';
import { useRefetchComponents } from '@/hooks/zustand/useRefetchComponent';

const DeleteChannelModal = () => {
  const { type, isOpen, onClose, data } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const axiosAuth = useAxiosAuth();
  const { toast } = useToast();
  const { triggerRefetchComponents } = useRefetchComponents();

  const isModalOpen = type === 'deleteChannel' && isOpen;
  const { server, channel, userId } = data;

  const handleCloseModal = () => {
    onClose();
  };

  const deleteChannel = async () => {
    setIsLoading(true);
    const res = await axiosAuth.delete(
      `/channels/${channel?.id}?userId=${userId}&serverId=${server?.id}`
    );
    if (res.status === 200) {
      toast({
        title: 'Channel deleted successfully!'
      });
      console.log(res.data);
    } else {
      toast({
        title: 'Something went wrong',
        variant: 'destructive'
      });
    }
    setIsLoading(false);
    handleCloseModal();
    // router.push(`/servers/${server?.id}`);
    triggerRefetchComponents(['ServerSidebar']);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-6 pb-2 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Channel
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="px-6 text-zinc-500">
          Are you sure you want to delete{' '}
          <span className="font-bold">{channel?.name}</span>? This action is
          irreversible.
        </DialogDescription>
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
              onClick={deleteChannel}
              className="text-white bg-red-500 hover:bg-red-600"
            >
              Delete Channel
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteChannelModal;
