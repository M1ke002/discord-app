import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  src?: string;
  className?: string;
  username?: string;
  avatarFallbackClassName?: string;
}

const UserAvatar = ({
  src,
  className,
  username,
  avatarFallbackClassName
}: UserAvatarProps) => {
  return (
    <Avatar className={className}>
      <AvatarImage src={src === '' ? undefined : src} />
      <AvatarFallback
        className={cn('text-white bg-[#5865f2]', avatarFallbackClassName)}
      >
        {username?.split('')[0].toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
