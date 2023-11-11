'use client';

import React, { useState } from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogDescription
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useModal } from '@/hooks/zustand/useModal';
import { Label } from '../ui/label';

const JoinServerModal = () => {
  const [inviteCode, setInviteCode] = useState('');
  const [isError, setIsError] = useState(false);
  const { type, isOpen, onOpen, onClose } = useModal();
  const isModalOpen = type === 'joinServer' && isOpen;

  const handleCloseModal = () => {
    setInviteCode('');
    setIsError(false);
    onClose();
  };

  const joinServer = () => {
    if (inviteCode.trim() === '') {
      setIsError(true);
      return;
    }
    window.location.href = `/invite/${inviteCode}`;
    handleCloseModal();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Join a server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Enter an invite code below to join an existing server.
          </DialogDescription>
        </DialogHeader>
        <div className="px-4 pb-2">
          <Label htmlFor="inviteCode">Invite code</Label>
          <Input
            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 mt-1"
            type="text"
            id="inviteCode"
            placeholder="Enter an invite code"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
          />
          {isError && (
            <p className="text-xs text-rose-500 mt-1">
              Please enter a valid invite code.
            </p>
          )}
        </div>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="w-full flex items-center justify-between">
            <Button
              variant="ghost"
              type="button"
              onClick={() => onOpen('newServerOptions')}
            >
              Back
            </Button>
            <Button variant="primary" onClick={joinServer}>
              Join server
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JoinServerModal;
