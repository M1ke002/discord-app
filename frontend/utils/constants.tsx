import { Hash, MemoryStick, ShieldAlert, ShieldCheck, User2, Video, Volume2 } from 'lucide-react';


// export const channelIconMap = {
//     "text": <Hash className='h-4 w-4 mr-2'/>,
//     "audio": <Volume2 className='h-4 w-4 mr-2'/>,
//     "video": <Video className='h-4 w-4 mr-2'/>
// }

export const getChannelIcon = (customClasses: string) => {
  return {
    "TEXT": <Hash className={customClasses}/>,
    "VOICE": <Volume2 className={customClasses}/>,
    "VIDEO": <Video className={customClasses}/>
  }
}

export const getRoleIcon = (customClasses: string) => {
  return {
    "MEMBER": null,
    "MODERATOR": <ShieldCheck className={`text-indigo-500 ${customClasses}`}/>,
    "ADMIN": <ShieldAlert className={`text-rose-500 ${customClasses}`}/>
  }
}
  
// export const roleIconMap = (customClasses: string) => {
//   return {
//     'Member': <User2 className='h-4 w-4 mr-2'/>,
//     'Moderator': <ShieldCheck className='h-4 w-4 mr-2 text-indigo-500'/>,
//     'Admin': <ShieldAlert className='h-4 w-4 mr-2 text-rose-500'/>
//   }
// }

export enum ChannelType {
  TEXT = "text",
  VOICE = "voice",
  VIDEO = "video"
}

export enum MemberRole {
  ADMIN = "Admin",
  MODERATOR = "Moderator",
  MEMBER = "Member"
}


//fake data used for generating the server sidebar (including the server header and channels)
export const dummyServer = {
    name: 'csgo',
    channels: [
      {
        type: ChannelType.TEXT,
        id: '1',
        name: 'general'
      },
      {
        type: ChannelType.VOICE,
        id: '2',
        name: 'voice chat'
      },
      {
        type: ChannelType.VIDEO,
        id: '3',
        name: 'video chat'
      },
      {
        type: ChannelType.TEXT,
        id: '4',
        name: 'trash'
      },
    ],
    members: [
      {
        profileId: '1',
        name: 'member1',
        nickname: 'Member1',
        role: MemberRole.MODERATOR,
        avatarUrl: 'https://utfs.io/f/14bd6e96-89b9-4a8b-9446-d6ca74fa5949-k4kllm.jpg'
      },
      {
        profileId: '2',
        name: 'member2',
        nickname: 'Member2',
        role: MemberRole.ADMIN,
        avatarUrl: 'https://utfs.io/f/14bd6e96-89b9-4a8b-9446-d6ca74fa5949-k4kllm.jpg'
      },
      {
        profileId: '3',
        name: 'member3',
        nickname: 'Member3',
        role: MemberRole.MEMBER,
        avatarUrl: 'https://utfs.io/f/14bd6e96-89b9-4a8b-9446-d6ca74fa5949-k4kllm.jpg'
      }
    ],
    inviteCode: '123abcd',
    imageUrl: 'https://utfs.io/f/14bd6e96-89b9-4a8b-9446-d6ca74fa5949-k4kllm.jpg'
    // imageUrl: null
  };

//fake data used for generating a list of servers of a user, in the navigation bar
export const dummyServerList = [
    {
        id: '123',
        name: 'dsds',
        imageUrl: 'https://utfs.io/f/14bd6e96-89b9-4a8b-9446-d6ca74fa5949-k4kllm.jpg'
    },
    {
        id: '245',
        name: 'csgo',
        imageUrl: 'https://utfs.io/f/9455970e-4afb-4fde-afa2-f4a4f7fee873-3kvko5.png'
    },
    {
        id: '2456',
        name: 'dsds',
        imageUrl: null
    }
];

export interface IServerOptionalProps {
  server?: {
    name: string;
    channels: { type: string }[];
    members: { profileId: string; name: string; role: string, avatarUrl: string }[];
    inviteCode: string;
    imageUrl: string | null;
  },
}

export interface IServerProps {
  server: {
    name: string;
    channels: { type: string }[];
    members: { profileId: string; name: string; role: string, avatarUrl: string }[];
    inviteCode: string;
    imageUrl: string | null;
  },
}

