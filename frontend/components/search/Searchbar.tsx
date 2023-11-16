import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import SearchBarMenu from './SearchbarMenu';
import SearchbarTagWrapper from './SearchbarTagWrapper';
import SearchbarInput from './SearchbarInput';

const SearchBar = () => {
  const [gotRidOfScrollbar, setGotRidOfScrollbar] = useState(false);
  const [xIconVisible, setXIconVisible] = useState(false);
  const [isSearchOptionsOpen, setIsSearchOptionsOpen] = useState(false);

  const [currentTags, setCurrentTags] = useState<string[]>([]);

  const searchbarRef = useRef<HTMLDivElement>(null);
  const searchbarMenuRef = useRef<HTMLDivElement>(null);
  const inputWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gotRidOfScrollbar) {
      const inputWrapper = inputWrapperRef.current;
      if (!inputWrapper) return;
      inputWrapper.style.paddingBottom =
        inputWrapper.offsetHeight - inputWrapper.clientHeight + 'px';
      setGotRidOfScrollbar(true);
    }
  }, []);

  const handleScrollLeft = () => {
    if (!inputWrapperRef.current) return;
    let scrollLeft = inputWrapperRef.current.scrollLeft;
    if (scrollLeft !== 0) {
      inputWrapperRef.current.scrollLeft = Math.max(0, scrollLeft - 8);
    }
  };

  const deleteTag = (tag: string) => {
    setCurrentTags(currentTags.filter((t) => t !== tag));
  };

  return (
    <div className="relative flex items-center bg-zinc-200 dark:bg-[#1e1f22] rounded-md">
      <div className="pl-2 pr-1 pointer-events-none">
        <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
      </div>
      <div
        className="bg-zinc-200 dark:bg-[#1e1f22] w-[220px] h-[30px] overflow-hidden rounded-r-md"
        ref={searchbarRef}
      >
        <div
          className="flex overflow-x-scroll overflow-y-hidden max-w-[100%] pb-0 mr-2"
          ref={inputWrapperRef}
          onClick={() => {
            setIsSearchOptionsOpen(true);
          }}
        >
          <SearchbarTagWrapper
            currentTags={currentTags}
            deleteTag={deleteTag}
          />
          <SearchbarInput
            handleScrollLeft={handleScrollLeft}
            currentTags={currentTags}
          />
        </div>

        {/* <div className="flex items-center w-6">
          {xIconVisible && (
            <X
              className="w-4 h-4 text-zinc-500 dark:text-zinc-400 cursor-pointer"
              onClick={clearSearchBar}
            />
          )}
        </div> */}
      </div>
      <SearchBarMenu
        isOpen={isSearchOptionsOpen}
        setIsOpen={setIsSearchOptionsOpen}
        searchbarRef={inputWrapperRef}
        searchbarMenuRef={searchbarMenuRef}
        currentTags={currentTags}
        setCurrentTags={setCurrentTags}
      />
    </div>
  );
};

export default SearchBar;
