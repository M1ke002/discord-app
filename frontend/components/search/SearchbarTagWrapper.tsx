import React from 'react';
import SearchbarTag from './SearchbarTag';

interface SearchbarTagWrapperProps {
  currentTags: string[];
  deleteTag: (tag: string) => void;
}

const SearchbarTagWrapper = ({
  currentTags,
  deleteTag
}: SearchbarTagWrapperProps) => {
  return (
    <div className="flex px-[2px]">
      {currentTags.map((tag) => (
        <SearchbarTag
          key={tag}
          tagType={tag as 'from' | 'has' | 'before' | 'after'}
          deleteTag={deleteTag}
        />
      ))}
    </div>
  );
};

export default SearchbarTagWrapper;
