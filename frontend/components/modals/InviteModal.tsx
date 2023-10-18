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
import { Check, Copy, RefreshCw } from 'lucide-react';
import { useOrigin } from '@/hooks/useOrigin';
import { useRouter } from 'next/navigation';
import useAxiosAuth from '@/hooks/useAxiosAuth';

const InviteModal = () => {
  const { type, isOpen, onOpen, onClose, data } = useModal();
  const origin = useOrigin();
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const axiosAuth = useAxiosAuth();
  const router = useRouter();

  const isModalOpen = type === 'invite' && isOpen;
  const { server } = data;
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  const generateNewInviteUrl = async () => {
    setIsLoading(true);
    try {
      //call api to generate new invite url
      const res = await axiosAuth.put(`/servers/${server?.id}/invite-code`);
      console.log(res.data);
      if (res.status == 200) {
        if (server) {
          server.inviteCode = res.data.response;
          //reopen modal with new invite url
          onOpen('invite', { server });
          // router.push(`/servers/${server?.id}`);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite friends
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Invite a friend to join your server!
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
            Server invite link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              readOnly
              disabled={isLoading}
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
              value={inviteUrl}
            />
            <Button size="icon" onClick={onCopy} disabled={isLoading}>
              {isCopied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <Button
            variant="link"
            size="sm"
            className="text-xs text-zinc-500 mt-4 px-0"
            onClick={generateNewInviteUrl}
            disabled={isLoading}
          >
            Generate a new link
            <RefreshCw className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
