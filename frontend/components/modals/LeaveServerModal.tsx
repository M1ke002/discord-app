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

const LeaveServerModal = () => {
  const { type, isOpen, onOpen, onClose, data } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const axiosAuth = useAxiosAuth();
  const { toast } = useToast();

  const isModalOpen = type === 'leaveServer' && isOpen;
  const { server, userId } = data;

  const leaveServer = async () => {
    try {
      setIsLoading(true);
      const res = await axiosAuth.put(
        `/servers/${server?.id}/leave?userId=${userId}`
      );
      if (res.status === 200) {
        toast({
          title: 'Left server successfully!'
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
    // await axios.put(`/api/servers/${server?.id}/leave`);
    // router.refresh();
    setIsLoading(false);
    router.push('/');
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-6 pb-2 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Leave server
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="px-6 text-zinc-500">
          Are you sure you want to leave{' '}
          {
            <span className="font-semibold text-indigo-500">
              {server?.name}
            </span>
          }
          {/* ? You won't be able to rejoin unless you have an invite link. */}?
          You won&apos;t be able to rejoin unless you have an invite link.
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
              onClick={leaveServer}
              className="text-white bg-red-500 hover:bg-red-600"
            >
              Leave server
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveServerModal;
