interface User {
  id: number;
  username: string;
  nickname: string;
  avatarUrl?: string;
  imageKey?: string;
  createdAt: string;
  updatedAt: string | null;
}

export default User;
