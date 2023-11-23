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

export const extractLinkInContent = (content: string) => {
  const regex = /https?:\/\/[^\s]+/g;

  const matches = content.match(regex);

  //extract the normal text plus the links
  const result: {
    type: 'text' | 'link';
    text: string;
  }[] = [];

  let lastIndex = 0;
  matches?.forEach((match) => {
    const index = content.indexOf(match);
    const text = content.substring(lastIndex, index);
    if (text.trim() !== '') {
      result.push({
        type: 'text',
        text
      });
    }
    result.push({
      type: 'link',
      text: match
    });
    lastIndex = index + match.length;
  });
  if (lastIndex !== content.length)
    result.push({
      type: 'text',
      text: content.substring(lastIndex, content.length)
    });

  return result;
};

export const extractSearchContent = (
  content: string,
  searchContent: string
) => {
  //extract the normal text and the search content into an array
  const result: {
    type: 'text' | 'highlight';
    text: string;
  }[] = [];

  const regex = new RegExp(searchContent, 'gi');
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const index = match.index;
    const text = content.substring(lastIndex, index);
    if (text.trim() !== '') {
      result.push({
        type: 'text',
        text
      });
    }
    result.push({
      type: 'highlight',
      text: match[0]
    });
    lastIndex = index + match[0].length;
  }
  if (lastIndex !== content.length)
    result.push({
      type: 'text',
      text: content.substring(lastIndex, content.length)
    });

  // console.log(result);
  return result;
};
