import { X } from 'lucide-react';
import React from 'react';

interface SearchbarTagProps {
  tagType: 'from' | 'has' | 'before' | 'after';
  deleteTag: (tag: string) => void;
}

const SearchbarTag = ({ tagType, deleteTag }: SearchbarTagProps) => {
  return (
    <div className="flex items-center bg-[#34383d] my-1 mr-1 px-1 rounded-sm">
      <div className="text-xs bg-transparent mr-1" tabIndex={0}>
        {tagType}
      </div>
      {/* <button tabIndex={0}></button> */}
      <X
        onClick={() => deleteTag(tagType)}
        className="w-[12px] h-[12px] text-zinc-500 dark:text-zinc-400 bg-transparent cursor-pointer"
      />
    </div>
  );
};

export default SearchbarTag;
