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
import useAxiosAuth from '@/hooks/useAxiosAuth';
import { useToast } from '../ui/use-toast';
import { useReplyToMessage } from '@/hooks/zustand/useReplyToMessage';
import axios from 'axios';

const DeleteMessageModal = () => {
  const { type, isOpen, onClose, data } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const axiosAuth = useAxiosAuth();
  const { message: replyToMessage, setMessage } = useReplyToMessage();

  const isModalOpen = type === 'deleteMessage' && isOpen;
  const {
    messageType,
    fileKey,
    messageId,
    userId,
    otherUserId,
    serverId,
    channelId
  } = data;

  const handleCloseModal = () => {
    if (isLoading) return;
    onClose();
  };

  const deleteMessage = async () => {
    let query = '';
    if (messageType === 'channelMessage') {
      query = `/messages/${messageId}?userId=${userId}&channelId=${channelId}&serverId=${serverId}`;
    } else {
      query = `/direct-messages/${messageId}?userId=${userId}&otherUserId=${otherUserId}`;
    }
    console.log(query);
    try {
      setIsLoading(true);

      //if there is a file key, delete the file from uploadthing server
      if (fileKey) {
        console.log('message has filekey');
        const res = await axios.delete(
          `/api/uploadthing-files?fileKey=${fileKey}`
        );
        if (res.data.status === 'error') {
          console.log(
            'error deleting file from uploadthing server',
            res.data.message
          );
          return;
        }
      }

      const res = await axiosAuth.delete(query);
      console.log(res.data);

      //if we are replying to the deleted message, remove the reply
      if (replyToMessage?.id === messageId) {
        setMessage(null);
      }
    } catch (error) {
      console.log('[delete message modal]: ' + error);
    }
    setIsLoading(false);
    handleCloseModal();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-6 pb-2 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Message
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="px-6 text-zinc-500">
          Are you sure you want to delete this message?
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
              onClick={deleteMessage}
              className="text-white bg-red-500 hover:bg-red-600"
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMessageModal;
