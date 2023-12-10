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
      <div className="flex items-center bg-[#80848e] dark:bg-[#34383d] my-1 mr-1 px-1 rounded-sm w-[max-content]">
        <div className="text-xs text-white bg-transparent mr-1" tabIndex={0}>
          {tagName === 'has' && `${tagName} file`}
          {tagName !== 'has' &&
            (tagValue
              ? `${tagName}: ${
                  tagValue.substring(0, 4) + (tagValue.length > 4 ? '...' : '')
                }`
              : `${tagName}:`)}
        </div>
        <X
          onClick={(e) => {
            e.stopPropagation();
            deleteTag(tagName);
          }}
          className="w-[12px] h-[12px] text-white dark:text-zinc-400 bg-transparent cursor-pointer"
        />
      </div>
    </TooltipActions>
  );
};

export default SearchbarTag;
