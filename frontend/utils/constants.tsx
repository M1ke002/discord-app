import {
  Hash,
  MemoryStick,
  ShieldAlert,
  ShieldCheck,
  User2,
  Video,
  Volume2
} from 'lucide-react';

// export const channelIconMap = {
//     "text": <Hash className='h-4 w-4 mr-2'/>,
//     "audio": <Volume2 className='h-4 w-4 mr-2'/>,
//     "video": <Video className='h-4 w-4 mr-2'/>
// }

export const getChannelIcon = (customClasses: string) => {
  return {
    TEXT: <Hash className={customClasses} />,
    VOICE: <Volume2 className={customClasses} />,
    VIDEO: <Video className={customClasses} />
  };
};

export const getRoleIcon = (customClasses: string) => {
  return {
    MEMBER: null,
    MODERATOR: <ShieldCheck className={`text-indigo-500 ${customClasses}`} />,
    ADMIN: <ShieldAlert className={`text-rose-500 ${customClasses}`} />
  };
};

// export const roleIconMap = (customClasses: string) => {
//   return {
//     'Member': <User2 className='h-4 w-4 mr-2'/>,
//     'Moderator': <ShieldCheck className='h-4 w-4 mr-2 text-indigo-500'/>,
//     'Admin': <ShieldAlert className='h-4 w-4 mr-2 text-rose-500'/>
//   }
// }

export enum ChannelType {
  TEXT = 'TEXT',
  VOICE = 'VOICE',
  VIDEO = 'VIDEO'
}

export enum MemberRole {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  MEMBER = 'MEMBER'
}

export const dummyConversationList = [
  {
    id: 2,
    name: 'John Doe',
    avatarUrl:
      'https://utfs.io/f/f7fde577-81f8-4ca0-8414-0663410bd819-n92lk7.jpg'
  },
  {
    id: 3,
    name: 'John Doe2',
    avatarUrl:
      'https://utfs.io/f/f7fde577-81f8-4ca0-8414-0663410bd819-n92lk7.jpg'
  },
  {
    id: 4,
    name: 'John Doe3',
    avatarUrl:
      'https://utfs.io/f/f7fde577-81f8-4ca0-8414-0663410bd819-n92lk7.jpg'
  },
  {
    id: 5,
    name: 'John Doe45',
    avatarUrl:
      'https://utfs.io/f/f7fde577-81f8-4ca0-8414-0663410bd819-n92lk7.jpg'
  },
  {
    id: 6,
    name: 'John Doe5',
    avatarUrl:
      'https://utfs.io/f/f7fde577-81f8-4ca0-8414-0663410bd819-n92lk7.jpg'
  },
  {
    id: 7,
    name: 'John Doe6',
    avatarUrl:
      'https://utfs.io/f/f7fde577-81f8-4ca0-8414-0663410bd819-n92lk7.jpg'
  }
];
