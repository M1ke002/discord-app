import React from 'react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { cn } from '@/lib/utils';

interface UserAvatarProps {
    src?: string;
    className?: string;
    username?: string;
}

const UserAvatar = ({src, className, username}: UserAvatarProps) => {
  return (
    <Avatar className={cn("h-7 w-7 md:h-10 md:w-10", className)}>
      <AvatarImage src={src} />
      <AvatarFallback>{username?.split("")[0].toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}

export default UserAvatar