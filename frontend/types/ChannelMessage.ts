import UploadthingFile from './File';
import Member from './Member';

interface ChannelMessage {
  id: number;
  content: string;
  file: UploadthingFile | null;
  sender: Member;
  channelId: number;
  replyToMessage: ChannelMessage | null;
  hasReplyMessage: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export default ChannelMessage;
