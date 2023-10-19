import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  src?: string;
  className?: string;
  username?: string;
}

const UserAvatar = ({ src, className, username }: UserAvatarProps) => {
  return (
    <Avatar className={className}>
      <AvatarImage src={src} />
      <AvatarFallback className="dark:text-white">
        {username?.split('')[0].toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
