export const getTokenFromHeader = (header: string) => {
  return header.substring(7);
};

export const getConversationIdFromUrl = (url: string) => {
  const segments = url.split('/');

  const conversationSegmentIndex = segments.indexOf('conversations');

  if (conversationSegmentIndex === -1) {
    return null;
  }

  const conversationId = segments[conversationSegmentIndex + 1];

  return conversationId;
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
