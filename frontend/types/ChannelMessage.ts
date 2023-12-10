import UploadthingFile from './File';
import User from './User';

interface ChannelMessage {
  id: number;
  content: string;
  file: UploadthingFile | null;
  sender: User;
  channelId: number;
  replyToMessage: ChannelMessage | null;
  hasReplyMessage: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export default ChannelMessage;
