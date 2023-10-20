'use client';

import TooltipActions from '../TooltipActions';
import UserAvatar from '../UserAvatar';
import { getRoleIcon } from '@/utils/constants';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const chatReplyIconClassName =
  'before:block before:absolute before:top-[37%] before:right-[100%] before:bottom-0 before:left-[-36px] before:mt-[-1px] before:mr-[4px] before:mb-[3px] before:ml-[-1px] before:border-t-[1.6px] before:border-t-zinc-600 before:border-l-[1.6px] before:border-l-zinc-600 before:rounded-tl-[6px]';

interface ChatItemProps {
  type: 'new' | 'continue';
  isReplyMessage?: boolean;
}

const ChatItem = ({ type = 'new', isReplyMessage = false }: ChatItemProps) => {
  const [displayTime, setDisplayTime] = useState(false);
  return (
    <div
      className={cn(
        'relative group flex flex-col items-center hover:bg-black/5 px-4 py-1 transition w-full',
        type === 'new' && 'mt-4'
      )}
      onMouseEnter={() => setDisplayTime(true)}
      onMouseLeave={() => setDisplayTime(false)}
    >
      <div
        className={cn(
          'group flex gap-x-2 w-full',
          type === 'new' ? 'items-start' : 'items-center'
        )}
      >
        <div className="min-w-[48px]">
          {type === 'new' ? (
            <div>
              {isReplyMessage && (
                <div className="h-6">
                  {/* Just a placeholder for the chat reply icon */}
                </div>
              )}
              <div className="cursor-pointer hover:drop-shadow-md">
                <UserAvatar username="John Doe" />
              </div>
            </div>
          ) : (
            <div>
              {displayTime && (
                <p className="text-zinc-400 text-[10px]">2:24 AM</p>
              )}
            </div>
          )}
        </div>

        {type === 'new' && (
          <div className="flex flex-col w-full">
            {isReplyMessage && (
              <div className="relative">
                <div
                  className={cn(
                    'flex items-center mb-2',
                    chatReplyIconClassName
                  )}
                >
                  <UserAvatar
                    username="John Doe"
                    className="h-4 w-4"
                    avatarFallbackClassName="text-[7px]"
                  />
                  <p className="text-xs text-zinc-400 ml-1 font-semibold hover:underline cursor-pointer">
                    @John Doe
                  </p>
                  <p className="text-xs text-zinc-400 ml-1 overflow-ellipsis hover:text-zinc-200 cursor-pointer">
                    The previous message was about a cat
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-x-2">
              <div className="flex items-center">
                <p className="font-semibold text-sm hover:underline cursor-pointer">
                  <span className="text-rose-500">John Doe</span>
                </p>
                <TooltipActions label="admin">
                  <p className="ml-1">
                    {
                      getRoleIcon('h-4 w-4')[
                        'ADMIN' as keyof typeof getRoleIcon
                      ]
                    }
                  </p>
                </TooltipActions>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-1">
                  05/12/2022 10:30 PM
                </span>
              </div>
            </div>
            <div className="text-zinc-300 text-sm">
              asd ads ad dad s s relative group flex items-center relative group
              flex items-center relative group flex items-center relative group
              flex items-center
            </div>
          </div>
        )}

        {type === 'continue' && (
          <div className="text-zinc-300 text-sm">
            Another message from the same user
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatItem;
