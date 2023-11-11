'use client';

import React, { useState } from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogDescription
} from '../ui/dialog';
import { useModal } from '@/hooks/zustand/useModal';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSession } from 'next-auth/react';
import { useOrigin } from '@/hooks/useOrigin';
import { useRouter } from 'next/navigation';
import useAxiosAuth from '@/hooks/useAxiosAuth';
import { ChevronRight } from 'lucide-react';

const NewServerOptionsModal = () => {
  const { type, isOpen, onOpen, onClose, data } = useModal();
  const axiosAuth = useAxiosAuth();
  const { data: session } = useSession();

  const isModalOpen = type === 'newServerOptions' && isOpen;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden max-w-sm">
        <DialogHeader className="pt-8">
          <DialogTitle className="text-2xl text-center font-bold">
            Add a server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Join a server or create a new one.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex flex-col p-4 pb-6 space-y-3">
          <div
            className="flex items-center justify-between px-3 py-4 border-[1px] rounded-md border-zinc-300 cursor-pointer hover:bg-zinc-200"
            onClick={() =>
              onOpen('createServer', { userId: session?.user.id.toString() })
            }
          >
            <p className="text-xs font-bold text-black">Create my own</p>
            <ChevronRight className="h-4 w-4" />
          </div>

          <div
            className="flex items-center justify-between px-3 py-4 border-[1px] rounded-md border-zinc-300 cursor-pointer hover:bg-zinc-200"
            onClick={() =>
              onOpen('joinServer', { userId: session?.user.id.toString() })
            }
          >
            <p className="text-xs font-bold text-black">Join a Server</p>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewServerOptionsModal;
