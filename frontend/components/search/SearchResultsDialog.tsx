import React, { Fragment, useEffect } from 'react';
import { cn } from '@/lib/utils';
import SearchResultItem from './SearchResultItem';
import { Hash, Loader2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import Paginator from './Paginator';
import ChannelMessage from '@/types/ChannelMessage';
import { useServerData } from '@/hooks/zustand/useServerData';
import { useRouter, useParams } from 'next/navigation';
import Channel from '@/types/Channel';

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
  setIsLoading: (isLoading: boolean) => void;
  searchData: {
    query: string;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    messages: ChannelMessage[];
    totalMessages: number;
  };
  setSearchData: (searchData: {
    query: string;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    messages: ChannelMessage[];
    totalMessages: number;
  }) => void;
}

const SearchResultsDialog = ({
  toggleSearchDialog,
  setToggleSearchDialog,
  searchbarRef,
  searchResultsDialogRef,
  isLoading,
  setIsLoading,
  searchData,
  setSearchData
}: SearchResultsDialogProps) => {
  const { server } = useServerData();
  const router = useRouter();
  const params = useParams();

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
        <span>
          {isLoading ? 'Searching...' : `${searchData.totalMessages} results`}
        </span>
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
        <div>
          <ScrollArea className="block h-[440px] shadow-md border-[1px] rounded-b-md bg-[#2b2d31]">
            <div className="flex flex-col p-3 px-4 text-xs text-zinc-300">
              {searchData.messages.length > 0 && (
                <>
                  {searchData.messages.map((message, index) => {
                    let channel: Channel | null = null;
                    const prevMessage =
                      index > 0 ? searchData.messages[index - 1] : null;
                    if (prevMessage?.channelId !== message.channelId) {
                      channel = server?.channels.find(
                        (channel) => channel.id === message.channelId
                      ) as Channel;
                    }
                    return (
                      <Fragment key={index}>
                        {channel && (
                          <div className="flex items-center space-x-1 mt-1 mb-2">
                            <Hash className="w-5 h-5 text-black dark:text-white" />
                            <p
                              className="font-semibold text-[1rem] text-black dark:text-white hover:underline cursor-pointer"
                              onClick={() => {
                                if (channel) {
                                  router.push(
                                    `/servers/${params?.serverId}/channels/${channel.id}`
                                  );
                                }
                              }}
                            >
                              {channel.name}
                            </p>
                          </div>
                        )}
                        <SearchResultItem message={message} />
                      </Fragment>
                    );
                  })}
                  {searchData.totalPages > 1 && (
                    <Paginator
                      searchData={searchData}
                      setSearchData={setSearchData}
                      setIsLoading={setIsLoading}
                    />
                  )}
                </>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default SearchResultsDialog;
