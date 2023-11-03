import ChannelMessage from '@/types/ChannelMessage';
import DirectMessage from '@/types/DirectMessage';
import Member from '@/types/Member';
import User from '@/types/User';

export const getTokenFromHeader = (header: string) => {
  return header.substring(7);
};

export const checkIsNewDay = (currMessageDate: Date, prevMessageDate: Date) => {
  const currYear = currMessageDate.getFullYear(),
    currMonth = currMessageDate.getMonth(),
    currDay = currMessageDate.getDate();
  const prevYear = prevMessageDate.getFullYear(),
    prevMonth = prevMessageDate.getMonth(),
    prevDay = prevMessageDate.getDate();
  const isNewDay =
    currYear !== prevYear || currMonth !== prevMonth || currDay !== prevDay;
  return isNewDay;
};

export const isChannelMessage = (
  message: ChannelMessage | DirectMessage
): message is ChannelMessage => {
  return 'channelId' in message;
};

export const isServerMember = (user: Member | User): user is Member => {
  return 'role' in user;
};
