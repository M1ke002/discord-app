import UploadthingFile from './File';
import User from './User';

interface DirectMessage {
  id: number;
  content: string;
  file: UploadthingFile | null;
  sender: User;
  replyToMessage: DirectMessage | null;
  hasReplyMessage: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export default DirectMessage;
