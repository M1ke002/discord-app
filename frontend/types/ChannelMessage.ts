import Member from './Member';

interface ChannelMessage {
  id: number;
  content: string;
  fileUrl: string | null;
  fileKey: string | null;
  sender: Member;
  channelId: number;
  replyToMessage: ChannelMessage | null;
  hasReplyMessage: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export default ChannelMessage;
