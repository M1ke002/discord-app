import { Hash, ShieldAlert, ShieldCheck, Video, Volume2 } from 'lucide-react';

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
