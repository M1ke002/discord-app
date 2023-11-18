import Member from '@/types/Member';
import { Plus } from 'lucide-react';
import React from 'react';
import UserAvatar from '../UserAvatar';

interface SearchbarMenuOptionProps {
  onOptionSelect: (type: string, tag: string | undefined, value: any) => void;
  type: string;
  tag?: string;
  tagDescription?: string;
  member?: Member;
  messageContains?: string;
}

const SearchbarMenuOption = ({
  onOptionSelect,
  type,
  tag,
  tagDescription,
  member,
  messageContains
}: SearchbarMenuOptionProps) => {
  return (
    <div
      className="flex items-center px-3 py-2 text-sm cursor-pointer group hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 hover:text-zinc-300 rounded-sm"
      onClick={() => {
        if (type === 'tag') {
          onOptionSelect(type, tag, '');
        } else if (type === 'from') {
          onOptionSelect(type, 'from', member);
        } else if (type === 'has') {
          onOptionSelect(type, 'has', messageContains);
        }
      }}
    >
      {type === 'tag' && (
        <div>
          <span className="font-semibold mr-1 text-zinc-300">{tag}:</span>
          {tagDescription}
        </div>
      )}

      {type === 'from' && (
        <div className="flex items-center">
          <UserAvatar
            src={member?.file?.fileUrl}
            username={member?.nickname}
            className="w-[24px] h-[24px] mr-2"
            avatarFallbackClassName="text-[12px]"
          />
          <span className="font-semibold mr-1 text-zinc-300">
            {member?.nickname}
          </span>
        </div>
      )}

      {type === 'has' && (
        <div>
          <span className="text-zinc-400">{messageContains}</span>
        </div>
      )}

      <Plus className="hidden h-4 w-4 ml-auto group-hover:block" />
    </div>
  );
};

export default SearchbarMenuOption;
