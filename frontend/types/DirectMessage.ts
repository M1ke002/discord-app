import User from './User';

interface DirectMessage {
  id: number;
  content: string;
  fileUrl: string | null;
  fileKey: string | null;
  sender: User;
  replyToMessage: DirectMessage | null;
  hasReplyMessage: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export default DirectMessage;
