import Channel from './Channel';
import Category from './Category';
import Member from './Member';
import UploadthingFile from './File';
//sample: {
//     id: 2,
//     name: "Mit's second server",
//     imageUrl: 'http://dog.com',
//     inviteCode: null,
//     ownerId: null,
//     createdAt: null,
//     updatedAt: null,
//     users: null,
//     channels: null,
//     categories: null
//   }

interface Server {
  id: number;
  name: string;
  file: UploadthingFile | null;
  inviteCode: string | null;
  ownerId: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  users: Member[];
  channels: Channel[];
  categories: Category[];
}

export default Server;
