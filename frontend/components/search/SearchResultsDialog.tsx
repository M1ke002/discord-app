import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import SearchResultItem from './SearchResultItem';
import { Hash, Loader2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import Paginator from './Paginator';

interface SearchResultsDialogProps {
  toggleSearchDialog: {
    isOpen: boolean;
    type: 'searchOptions' | 'searchResults';
  };
  setToggleSearchDialog: (toggleSearchDialog: {
    isOpen: boolean;
    type: 'searchOptions' | 'searchResults';
  }) => void;
  searchbarRef: any;
  searchResultsDialogRef: any;
  isLoading: boolean;
}

const SearchResultsDialog = ({
  toggleSearchDialog,
  setToggleSearchDialog,
  searchbarRef,
  searchResultsDialogRef,
  isLoading
}: SearchResultsDialogProps) => {
  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [toggleSearchDialog.type, toggleSearchDialog.isOpen]);

  const handleOutsideClick = (e: MouseEvent) => {
    // console.log('outside click dialog');
    if (
      searchbarRef.current &&
      !searchbarRef.current.contains(e.target as Node) &&
      searchResultsDialogRef.current &&
      !searchResultsDialogRef.current.contains(e.target as Node) &&
      toggleSearchDialog.isOpen &&
      toggleSearchDialog.type === 'searchResults'
    ) {
      setToggleSearchDialog({
        ...toggleSearchDialog,
        isOpen: false
      });
    }
  };

  return (
    <div
      className={cn(
        'hidden absolute top-9 -right-1 w-[480px] rounded-md mr-2 font-medium text-black dark:text-neutral-400 z-[30]',
        toggleSearchDialog.isOpen &&
          toggleSearchDialog.type === 'searchResults' &&
          'block'
      )}
      ref={searchResultsDialogRef}
    >
      <div className="flex items-center justify-between px-4 py-2 text-zinc-300 bg-[#1e1f22] h-[56px] rounded-t-md">
        <span>{isLoading ? 'Searching...' : '60 results'}</span>
        <button
          className="rounded-md bg-[#3a3c42] hover:bg-zinc-600 p-1 px-2 text-sm"
          onClick={() => {
            console.log('clearde');
            setToggleSearchDialog({ isOpen: false, type: 'searchOptions' });
          }}
        >
          Clear
        </button>
      </div>
      {isLoading && (
        // placeholder div
        <div className="flex items-center justify-center h-[70px] shadow-md border-[1px] rounded-b-md bg-[#2b2d31]">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
        </div>
      )}
      {!isLoading && (
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
            <Paginator />
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default SearchResultsDialog;
