import { X } from 'lucide-react';
import React from 'react';

interface SearchbarTagProps {
  tagName: string;
  tagValue: string;
  deleteTag: (tag: string) => void;
}

const SearchbarTag = ({ tagName, tagValue, deleteTag }: SearchbarTagProps) => {
  return (
    <div className="flex items-center bg-[#34383d] my-1 mr-1 px-1 rounded-sm w-[max-content]">
      <div className="text-xs bg-transparent mr-1" tabIndex={0}>
        {tagName === 'has' && `${tagName} file`}
        {tagName !== 'has' && `${tagName}: ${tagValue || ''}`}
      </div>
      <X
        onClick={(e) => {
          e.stopPropagation();
          deleteTag(tagName);
        }}
        className="w-[12px] h-[12px] text-zinc-500 dark:text-zinc-400 bg-transparent cursor-pointer"
      />
    </div>
  );
};

export default SearchbarTag;
