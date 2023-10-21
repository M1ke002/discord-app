import ChatItem from './ChatItem';
import ChatItemSeparator from './ChatItemSeparator';
import ChatWelcome from './ChatWelcome';

interface ChatMessagesProps {
  type: 'channel' | 'conversation';
  avatarUrl?: string;
  name?: string;
}

const ChatMessages = ({ type, name, avatarUrl }: ChatMessagesProps) => {
  return (
    <div className="flex-1 flex flex-col pt-4 overflow-y-auto">
      <div className="flex-1" />
      <ChatWelcome type={type} name={name} avatarUrl={avatarUrl} />
      <div className="flex flex-col-reverse mt-auto">
        <ChatItem type="new" />
        <ChatItem type="new" />
        <ChatItemSeparator />
        <ChatItem type="new" isReplyMessage={true} />
        <ChatItem type="continue" />
        <ChatItem type="new" />
        <ChatItemSeparator />
      </div>
    </div>
  );
};

export default ChatMessages;
