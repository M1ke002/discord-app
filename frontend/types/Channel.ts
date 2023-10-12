interface Channel {
    id: number;
    name: string;
    serverId: number;
    categoryId: number | null;
    type: string;
    createdAt: string;
    updatedAt: string | null;
  }

export default Channel;