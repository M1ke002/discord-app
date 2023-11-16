import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface SearchBarMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  searchbarRef: any;
  searchbarMenuRef: any;
  currentTags: string[];
  setCurrentTags: (currentTags: string[]) => void;
}

const SearchBarMenu = ({
  isOpen,
  setIsOpen,
  searchbarRef,
  searchbarMenuRef,
  currentTags,
  setCurrentTags
}: SearchBarMenuProps) => {
  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const handleOutsideClick = (e: MouseEvent) => {
    if (
      searchbarRef.current &&
      !searchbarRef.current.contains(e.target as Node) &&
      searchbarMenuRef.current &&
      !searchbarMenuRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const onOptionSelect = (tag: 'from' | 'has' | 'before' | 'after') => {
    setIsOpen(false);
    if (currentTags.includes(tag)) return;
    setCurrentTags([...currentTags, tag]);
  };

  return (
    <div
      className={cn(
        'hidden absolute top-9 -right-1 w-80 rounded-sm p-2 mr-2 font-medium text-black dark:text-neutral-400 space-y-[2px] bg-zinc-200 dark:bg-[#101011] z-[30]',
        isOpen && 'block'
      )}
      ref={searchbarMenuRef}
    >
      <div className="px-3 py-2 text-xs font-bold uppercase text-zinc-300">
        Search options
      </div>
      <div
        className="flex items-center px-3 py-2 text-sm cursor-pointer group hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 hover:text-zinc-300 rounded-sm"
        onClick={() => onOptionSelect('from')}
      >
        <div>
          <span className="font-semibold mr-1 text-zinc-300">from:</span>
          user
        </div>
        <Plus className="hidden h-4 w-4 ml-auto group-hover:block" />
      </div>
      <div
        className="flex items-center px-3 py-2 text-sm cursor-pointer group hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 hover:text-zinc-300 rounded-sm"
        onClick={() => onOptionSelect('has')}
      >
        <div>
          <span className="font-semibold mr-1 text-zinc-300">has:</span>
          image or file
        </div>
        <Plus className="hidden h-4 w-4 ml-auto group-hover:block" />
      </div>
      <div
        className="flex items-center px-3 py-2 text-sm cursor-pointer group hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 hover:text-zinc-300 rounded-sm"
        onClick={() => onOptionSelect('before')}
      >
        <div>
          <span className="font-semibold mr-1 text-zinc-300">before:</span>
          specific date
        </div>
        <Plus className="hidden h-4 w-4 ml-auto group-hover:block" />
      </div>
      <div
        className="flex items-center px-3 py-2 text-sm cursor-pointer group hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 hover:text-zinc-300 rounded-sm"
        onClick={() => onOptionSelect('after')}
      >
        <div>
          <span className="font-semibold mr-1 text-zinc-300">after:</span>
          specific date
        </div>
        <Plus className="hidden h-4 w-4 ml-auto group-hover:block" />
      </div>
    </div>
  );
};

export default SearchBarMenu;
