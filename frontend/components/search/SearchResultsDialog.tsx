import React from 'react';
import { cn } from '@/lib/utils';
import SearchResultItem from './SearchResultItem';
import { Hash } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface SearchResultsDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const SearchResultsDialog = ({
  isOpen,
  setIsOpen
}: SearchResultsDialogProps) => {
  return (
    <div
      className={cn(
        'hidden absolute top-9 -right-1 w-[480px] rounded-md mr-2 font-medium text-black dark:text-neutral-400 z-[30]',
        isOpen && 'block'
      )}
    >
      <div className="flex items-center justify-between px-4 py-2 text-zinc-300 bg-[#1e1f22] h-[56px] rounded-t-md">
        <span>60 results</span>
        <button
          className="rounded-md bg-[#3a3c42] hover:bg-zinc-600 p-1 px-2 text-sm"
          onClick={() => setIsOpen(false)}
        >
          Clear
        </button>
      </div>
      <ScrollArea className="h-[440px] shadow-md border-[1px] rounded-b-md">
        <div className="flex flex-col p-3 px-4 text-xs text-zinc-300 bg-[#2b2d31]">
          <div className="flex items-center space-x-1 mt-1 mb-2">
            <Hash className="w-5 h-5 text-black dark:text-white" />
            <p className="font-semibold text-[1rem] text-black dark:text-white hover:underline cursor-pointer">
              general
            </p>
          </div>
          <SearchResultItem />
          <SearchResultItem />
          <SearchResultItem />
          <SearchResultItem />
          <SearchResultItem />
          <SearchResultItem />
        </div>
      </ScrollArea>
    </div>
  );
};

export default SearchResultsDialog;
