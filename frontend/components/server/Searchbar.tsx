import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { useState } from 'react';

const SearchBar = () => {
  const [xIconVisible, setXIconVisible] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const clearSearchBar = () => {
    setSearchInput('');
    setXIconVisible(false);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative flex items-center bg-zinc-200 dark:bg-black rounded-md">
        <Input
          type="text"
          placeholder="Search"
          className="pl-8 focus-visible:ring-0 border-0 focus-visible:ring-offset-0 h-7 w-[180px] bg-zinc-200 dark:bg-black"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            if (e.target.value.length > 0) {
              setXIconVisible(true);
            } else {
              setXIconVisible(false);
            }
          }}
        />
        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        </div>
        <div className="flex items-center w-6">
          {xIconVisible && (
            <X
              className="w-4 h-4 text-zinc-500 dark:text-zinc-400 cursor-pointer"
              onClick={clearSearchBar}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
