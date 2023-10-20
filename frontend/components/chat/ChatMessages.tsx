import ChatItem from './ChatItem';
import ChatItemSeparator from './ChatItemSeparator';
import ChatWelcome from './ChatWelcome';

const ChatMessages = () => {
  return (
    <div className="flex-1 flex flex-col pt-4 overflow-y-auto">
      <div className="flex-1" />
      <ChatWelcome />
      <div className="flex flex-col-reverse mt-auto">
        <ChatItem type="new" />
        <ChatItem type="new" />
        <ChatItemSeparator />
        <ChatItem type="new" isReplyMessage={true} />
        <ChatItem type="continue" />
        <ChatItem type="new" />
      </div>
    </div>
  );
};

export default ChatMessages;
