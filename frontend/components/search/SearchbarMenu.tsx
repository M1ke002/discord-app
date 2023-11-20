import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { useServerData } from '@/hooks/zustand/useServerData';
import SearchbarMenuOption from './SearchbarMenuOption';
import { Separator } from '../ui/separator';

interface SearchBarMenuProps {
  toggleSearchDialog: {
    isOpen: boolean;
    type: 'searchOptions' | 'searchResults';
  };
  setToggleSearchDialog: (toggleSearchDialog: {
    isOpen: boolean;
    type: 'searchOptions' | 'searchResults';
  }) => void;
  searchbarRef: any;
  searchbarMenuRef: any;
  currentTags: {
    name: string;
    value: string;
  }[];
  setCurrentTags: (
    currentTags: {
      name: string;
      value: string;
    }[]
  ) => void;
  getSearchResults: () => void;
}

const SearchBarMenu = ({
  toggleSearchDialog,
  setToggleSearchDialog,
  searchbarRef,
  searchbarMenuRef,
  currentTags,
  setCurrentTags,
  getSearchResults
}: SearchBarMenuProps) => {
  const { server } = useServerData();

  // console.log('users: ' + JSON.stringify(server?.users));
  const latestTag =
    currentTags.length > 0 ? currentTags[currentTags.length - 1] : null;

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [toggleSearchDialog.type, toggleSearchDialog.isOpen]);

  const handleOutsideClick = (e: MouseEvent) => {
    // console.log('outside click menu');
    if (
      searchbarRef.current &&
      !searchbarRef.current.contains(e.target as Node) &&
      searchbarMenuRef.current &&
      !searchbarMenuRef.current.contains(e.target as Node) &&
      toggleSearchDialog.isOpen &&
      toggleSearchDialog.type === 'searchOptions'
    ) {
      setToggleSearchDialog({
        ...toggleSearchDialog,
        isOpen: false
      });
    }
  };

  const onOptionSelect = (
    type: string,
    tag: string | undefined,
    value: any
  ) => {
    setToggleSearchDialog({
      isOpen: false,
      type: 'searchOptions'
    });
    if (type === 'tag') {
      if (currentTags.find((t) => t.name === tag) || !tag) return;
      //add a new tag
      if (tag === 'has') {
        setCurrentTags([...currentTags, { name: tag, value: 'true' }]);
      } else {
        setCurrentTags([...currentTags, { name: tag, value: '' }]);
      }
    } else if (type === 'from') {
      currentTags[currentTags.length - 1].value =
        value.nickname.substring(0, 4) + '...';
    }
  };

  return (
    <div
      className={cn(
        'hidden absolute top-9 -right-1 w-80 rounded-sm p-2 mr-2 font-medium text-black dark:text-neutral-400 space-y-[2px] bg-zinc-200 dark:bg-[#101011] z-[30]',
        toggleSearchDialog.isOpen &&
          toggleSearchDialog.type === 'searchOptions' &&
          'block'
      )}
      ref={searchbarMenuRef}
    >
      <div className="px-3 py-2 text-xs font-bold uppercase text-zinc-300">
        {(!latestTag || latestTag.value !== '') && 'Search options'}
        {latestTag?.name === 'from' && latestTag.value === '' && 'From user'}
        {latestTag?.name === 'has' &&
          latestTag.value === '' &&
          'Message contains'}
      </div>
      {(!latestTag || latestTag.value !== '') && (
        <>
          <SearchbarMenuOption
            onOptionSelect={onOptionSelect}
            type="tag"
            tag="from"
            tagDescription="user"
          />
          <SearchbarMenuOption
            onOptionSelect={onOptionSelect}
            type="tag"
            tag="has"
            tagDescription="attachment"
          />
        </>
      )}
      {latestTag?.name === 'from' &&
        latestTag.value === '' &&
        server?.users.map((user) => {
          return (
            <SearchbarMenuOption
              key={user.id}
              onOptionSelect={onOptionSelect}
              type="from"
              member={user}
            />
          );
        })}
      {(!latestTag || latestTag.value !== '') && (
        <>
          <Separator className="bg-zinc-200 dark:bg-zinc-800 my-2 rounded-md" />
          <button
            className="px-3 flex items-center w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 hover:text-zinc-300 rounded-sm"
            onClick={() => {
              setToggleSearchDialog({
                isOpen: false,
                type: 'searchOptions'
              });
              getSearchResults();
            }}
          >
            <div className="py-2 text-xs font-semibold uppercase text-zinc-400">
              Click to search
            </div>
            <kbd className="pointer-events-none inline-flex select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground ml-auto">
              <span className="text-xs">Enter</span>
            </kbd>
          </button>
        </>
      )}
    </div>
  );
};

export default SearchBarMenu;
