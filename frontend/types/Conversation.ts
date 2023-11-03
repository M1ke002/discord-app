import User from './User';

interface Conversation {
  id: number;
  user1Id: number;
  user2Id: number;
  otherUser: User;
}

export default Conversation;
