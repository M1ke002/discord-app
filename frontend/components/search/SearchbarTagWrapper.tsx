import React from 'react';
import SearchbarTag from './SearchbarTag';

interface SearchbarTagWrapperProps {
  currentTags: {
    name: string;
    value: string;
  }[];
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
          key={tag.name}
          tagName={tag.name as 'from' | 'has' | 'before' | 'after'}
          tagValue={tag.value}
          deleteTag={deleteTag}
        />
      ))}
    </div>
  );
};

export default SearchbarTagWrapper;
