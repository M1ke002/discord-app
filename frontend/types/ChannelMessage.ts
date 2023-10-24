import Member from './Member';

interface ChannelMessage {
  id: number;
  content: string;
  fileUrl: string | null;
  sender: Member;
  channelId: number;
  replyToMessageId: number | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export default ChannelMessage;
