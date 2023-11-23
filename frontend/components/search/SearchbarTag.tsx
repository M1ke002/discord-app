import { X } from 'lucide-react';
import React from 'react';
import TooltipActions from '../TooltipActions';

interface SearchbarTagProps {
  tagName: string;
  tagValue: string;
  deleteTag: (tag: string) => void;
}

const SearchbarTag = ({ tagName, tagValue, deleteTag }: SearchbarTagProps) => {
  return (
    <TooltipActions
      label={tagName === 'has' ? `${tagName} file` : `${tagName}: ${tagValue}`}
    >
      <div className="flex items-center bg-[#34383d] my-1 mr-1 px-1 rounded-sm w-[max-content]">
        <div className="text-xs bg-transparent mr-1" tabIndex={0}>
          {tagName === 'has' && `${tagName} file`}
          {tagName !== 'has' &&
            (tagValue
              ? `${tagName}: ${tagValue.substring(0, 4) + '...'}`
              : `${tagName}:`)}
        </div>
        <X
          onClick={(e) => {
            e.stopPropagation();
            deleteTag(tagName);
          }}
          className="w-[12px] h-[12px] text-zinc-500 dark:text-zinc-400 bg-transparent cursor-pointer"
        />
      </div>
    </TooltipActions>
  );
};

export default SearchbarTag;
