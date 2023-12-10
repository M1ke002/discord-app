import UploadthingFile from './File';

interface User {
  id: number;
  username: string;
  nickname: string;
  file: UploadthingFile | null;
  role?: string;
  createdAt?: string;
  updatedAt?: string | null;
}

export default User;
