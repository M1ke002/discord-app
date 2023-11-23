import { Search, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import SearchBarMenu from './SearchbarMenu';
import SearchbarTagWrapper from './SearchbarTagWrapper';
import SearchbarInput from './SearchbarInput';
import SearchResultsDialog from './SearchResultsDialog';
import useAxiosAuth from '@/hooks/useAxiosAuth';
import { useParams } from 'next/navigation';
import ChannelMessage from '@/types/ChannelMessage';

const SearchBar = () => {
  const axiosAuth = useAxiosAuth();
  const params = useParams();

  const [gotRidOfScrollbar, setGotRidOfScrollbar] = useState(false);
  const [xIconVisible, setXIconVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toggleSearchDialog, setToggleSearchDialog] = useState<{
    isOpen: boolean;
    type: 'searchOptions' | 'searchResults';
  }>({
    isOpen: false,
    type: 'searchOptions'
  });
  const [currentTags, setCurrentTags] = useState<
    {
      name: string;
      value: string;
      userId?: string;
    }[]
  >([]);
  const [placeHolder, setPlaceHolder] = useState({
    hasPlaceholder: true,
    text: 'Search'
  });
  const [searchData, setSearchData] = useState<{
    query: string;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    messages: ChannelMessage[];
    totalMessages: number;
  }>({
    query: '',
    totalPages: 0,
    currentPage: 0,
    hasNextPage: false,
    messages: [],
    totalMessages: 0
  });

  const searchbarRef = useRef<HTMLDivElement>(null);
  const searchbarMenuRef = useRef<HTMLDivElement>(null);
  const searchResultsDialogRef = useRef<HTMLDivElement>(null);
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
    if (
      (inputRef.current?.innerText.trim() === '' ||
        placeHolder.hasPlaceholder) &&
      currentTags.length === 0
    )
      return;
    for (let i = 0; i < currentTags.length; i++) {
      if (!currentTags[i].value) return;
    }
    setToggleSearchDialog({ isOpen: true, type: 'searchResults' });
    let query = '/messages/search?page=0';
    currentTags.forEach((tag) => {
      if (tag.name === 'from') {
        if (tag.userId) query += `&userId=${tag.userId}`;
      } else if (tag.name === 'has') {
        query += `&hasFile=${tag.value}`;
      } else {
        query += `&${tag.name}=${tag.value}`;
      }
    });
    if (inputRef.current?.innerText.trim() !== '') {
      query += `&content=${inputRef.current?.innerText}`;
    }
    query += `&serverId=${params.serverId}`;
    console.log(query);
    setIsLoading(true);
    try {
      const res = await axiosAuth.get(query);
      console.log(res.data);
      setSearchData({
        query: query,
        totalPages: res.data.totalPages,
        currentPage: 0,
        hasNextPage: searchData.currentPage + 1 < res.data.totalPages,
        messages: res.data.messages,
        totalMessages: res.data.totalMessages
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative flex items-center bg-zinc-200 dark:bg-[color:var(--navbar-dark)] rounded-md"
      onMouseDown={() =>
        setToggleSearchDialog((prev) => ({ ...prev, isOpen: true }))
      }
    >
      <div
        className="bg-zinc-200 dark:bg-[color:var(--navbar-dark)] w-[220px] h-[30px] overflow-hidden rounded-l-md"
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
          <Search className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
        )}
      </div>
      <SearchBarMenu
        toggleSearchDialog={toggleSearchDialog}
        setToggleSearchDialog={setToggleSearchDialog}
        searchbarRef={inputWrapperRef}
        searchbarMenuRef={searchbarMenuRef}
        currentTags={currentTags}
        setCurrentTags={setCurrentTags}
        getSearchResults={getSearchResults}
      />
      <SearchResultsDialog
        toggleSearchDialog={toggleSearchDialog}
        setToggleSearchDialog={setToggleSearchDialog}
        searchbarRef={inputWrapperRef}
        searchResultsDialogRef={searchResultsDialogRef}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        searchData={searchData}
        setSearchData={setSearchData}
      />
    </div>
  );
};

export default SearchBar;
