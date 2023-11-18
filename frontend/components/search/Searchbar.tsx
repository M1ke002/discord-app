import { Search, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import SearchBarMenu from './SearchbarMenu';
import SearchbarTagWrapper from './SearchbarTagWrapper';
import SearchbarInput from './SearchbarInput';
import SearchResultsDialog from './SearchResultsDialog';
import { set } from 'date-fns';

const SearchBar = () => {
  const [gotRidOfScrollbar, setGotRidOfScrollbar] = useState(false);
  const [xIconVisible, setXIconVisible] = useState(false);
  const [isSearchOptionsOpen, setIsSearchOptionsOpen] = useState(false);
  const [isSearchResultOpen, setIsSearchResultOpen] = useState(false);
  const [currentTags, setCurrentTags] = useState<
    {
      name: string;
      value: string;
    }[]
  >([]);
  const [placeHolder, setPlaceHolder] = useState({
    hasPlaceholder: true,
    text: 'Search'
  });

  const searchbarRef = useRef<HTMLDivElement>(null);
  const searchbarMenuRef = useRef<HTMLDivElement>(null);
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLSpanElement>(null);

  //for hiding of scrollbar
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
    setCurrentTags(currentTags.filter((t) => t.name !== tag));
  };

  const clearSearchBar = () => {
    setCurrentTags([]);
    if (inputRef.current) {
      inputRef.current.innerText = '';
    }
    setPlaceHolder({ ...placeHolder, hasPlaceholder: true });
    setXIconVisible(false);
  };

  const getSearchResults = async () => {
    console.log('tags: ' + JSON.stringify(currentTags));
    console.log('text: ' + inputRef.current?.innerText);
    setIsSearchResultOpen(true);
    setIsSearchOptionsOpen(false);
  };

  return (
    <div
      className="relative flex items-center bg-zinc-200 dark:bg-[#1e1f22] rounded-md"
      onMouseDown={() => setIsSearchOptionsOpen(true)}
    >
      <div
        className="bg-zinc-200 dark:bg-[#1e1f22] w-[220px] h-[30px] overflow-hidden rounded-l-md"
        ref={searchbarRef}
      >
        <div
          className="flex overflow-x-scroll overflow-y-hidden max-w-[100%] pb-0 ml-1"
          ref={inputWrapperRef}
        >
          <SearchbarTagWrapper
            currentTags={currentTags}
            deleteTag={deleteTag}
          />
          <SearchbarInput
            handleScrollLeft={handleScrollLeft}
            currentTags={currentTags}
            inputRef={inputRef}
            placeHolder={placeHolder}
            setPlaceHolder={setPlaceHolder}
            setXIconVisible={setXIconVisible}
            getSearchResults={getSearchResults}
          />
        </div>
      </div>
      <div className="pr-2 pl-1">
        {xIconVisible ? (
          <X
            className="w-4 h-4 text-zinc-500 dark:text-zinc-400 cursor-pointer"
            onClick={clearSearchBar}
          />
        ) : (
          <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        )}
      </div>
      <SearchBarMenu
        isOpen={isSearchOptionsOpen}
        setIsOpen={setIsSearchOptionsOpen}
        searchbarRef={inputWrapperRef}
        searchbarMenuRef={searchbarMenuRef}
        currentTags={currentTags}
        setCurrentTags={setCurrentTags}
        getSearchResults={getSearchResults}
      />
      <SearchResultsDialog
        isOpen={isSearchResultOpen}
        setIsOpen={setIsSearchResultOpen}
      />
    </div>
  );
};

export default SearchBar;
