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
