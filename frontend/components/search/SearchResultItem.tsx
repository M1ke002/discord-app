import React from 'react';
import UserAvatar from '../UserAvatar';
import TooltipActions from '../TooltipActions';
import { MemberRole, getRoleIcon } from '@/utils/constants';
import { extractLinkInContent } from '@/utils/utils';
import { format } from 'date-fns';
import ChannelMessage from '@/types/ChannelMessage';
import { cn } from '@/lib/utils';
import { FileIcon } from 'lucide-react';
import Image from 'next/image';
import { useClickedMessageId } from '@/hooks/zustand/useClickedMessageId';

interface SearchResultItemProps {
  message: ChannelMessage;
}

const SearchResultItem = ({ message }: SearchResultItemProps) => {
  const { setClickedMessageId } = useClickedMessageId();

  const fileExtension = message.file?.fileUrl?.split('.').pop();
  const isImageFile =
    fileExtension === 'png' ||
    fileExtension === 'jpg' ||
    fileExtension === 'jpeg';
  const isPDFFile = fileExtension === 'pdf';

  return (
    <div
      className="bg-[#313338] hover:bg-zinc-700/50 rounded-md p-3 mb-2 cursor-pointer"
      style={{ overflowWrap: 'anywhere' }}
      onClick={() => setClickedMessageId(message.id.toString())}
    >
      <div className="flex gap-x-2 w-full relative items-start">
        <div className="min-w-[48px]">
          <div>
            <UserAvatar
              src={message.sender.file?.fileUrl}
              username={message.sender.nickname}
              avatarFallbackClassName="text-[15px]"
            />
          </div>
        </div>
        <div className="flex flex-col w-full overflow-x-hidden">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p className="font-semibold text-sm">
                <span
                  className={cn(
                    message.sender.role === MemberRole.ADMIN
                      ? 'text-rose-500'
                      : message.sender.role === MemberRole.MODERATOR
                      ? 'text-indigo-500'
                      : 'text-white'
                  )}
                >
                  {message.sender.nickname}
                </span>
              </p>
              <TooltipActions
                label={
                  message.sender.role === MemberRole.ADMIN
                    ? 'Admin'
                    : message.sender.role === MemberRole.MODERATOR
                    ? 'Moderator'
                    : 'Member'
                }
              >
                <p className="ml-1">
                  {
                    getRoleIcon('h-4 w-4')[
                      message.sender.role as keyof typeof getRoleIcon
                    ]
                  }
                </p>
              </TooltipActions>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-1">
                {format(new Date(message.createdAt), 'MM/dd/yyyy hh:mm a')}
              </span>
            </div>
          </div>
          <div className="text-black dark:text-zinc-300 text-sm">
            {extractLinkInContent(message.content).map((item, index) => {
              if (item.type === 'text') {
                return <span key={index}>{item.text}</span>;
              } else {
                return (
                  <a
                    key={index}
                    href={item.text}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline dark:text-blue-400"
                  >
                    {item.text}
                  </a>
                );
              }
            })}
            {message.updatedAt != null && (
              <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                (edited)
              </span>
            )}
          </div>

          {isImageFile && (
            <a
              href={message.file?.fileUrl || undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
            >
              <Image
                src={message.file?.fileUrl || ''}
                alt={message.content}
                fill
                sizes="100%"
                className="object-cover"
              />
            </a>
          )}

          {isPDFFile && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10 border w-64">
              <FileIcon className="w-10 h-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={message.file?.fileUrl || undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                {message.file?.fileName}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultItem;
