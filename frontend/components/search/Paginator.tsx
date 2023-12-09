import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import ChannelMessage from '@/types/ChannelMessage';
import useAxiosAuth from '@/hooks/useAxiosAuth';

interface PaginatorProps {
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
  setIsLoading: (isLoading: boolean) => void;
}

const Paginator = ({
  searchData,
  setSearchData,
  setIsLoading
}: PaginatorProps) => {
  const { currentPage, totalPages, hasNextPage } = searchData;

  const axiosAuth = useAxiosAuth();
  const [pageButtons, setPageButtons] = useState<
    {
      position: number;
      text: string;
      value: number | null;
    }[]
  >([]);

  useEffect(() => {
    //create array of page numbers. ex. [0,1,2,3,4,5]
    const pagesArray = Array(totalPages)
      .fill(0)
      .map((_, i) => i);

    const renderedPageButtons = [
      {
        position: 1,
        text: '1',
        value: 0
      },
      {
        position: 2,
        text: currentPage + 1 < 4 || pagesArray.length <= 5 ? '2' : '...',
        value: currentPage + 1 < 4 || pagesArray.length <= 5 ? 1 : null
      }
    ];

    if (pagesArray.length > 2) {
      renderedPageButtons.push({
        position: 3,
        text:
          currentPage + 1 <= 3 || pagesArray.length <= 5
            ? '3'
            : pagesArray.length > 5 && currentPage + 3 >= pagesArray.length
            ? `${pagesArray[pagesArray.length - 2]}`
            : `${currentPage + 1}`,
        value:
          currentPage + 1 <= 3 || pagesArray.length <= 5
            ? 2
            : pagesArray.length > 5 && currentPage + 3 >= pagesArray.length
            ? pagesArray[pagesArray.length - 2] - 1
            : currentPage
      });
    }

    if (pagesArray.length > 3) {
      renderedPageButtons.push({
        position: 4,
        text:
          pagesArray.length <= 5
            ? '4'
            : currentPage + 3 >= pagesArray.length
            ? `${pagesArray[pagesArray.length - 1]}`
            : '...',
        value:
          pagesArray.length <= 5
            ? 3
            : currentPage + 3 >= pagesArray.length
            ? pagesArray[pagesArray.length - 1] - 1
            : null
      });
    }

    if (pagesArray.length > 4) {
      renderedPageButtons.push({
        position: 5,
        text: `${pagesArray.length}`,
        value: pagesArray.length - 1
      });
    }

    setPageButtons(renderedPageButtons);
  }, [totalPages, currentPage, hasNextPage]);

  const onPageButtonClick = async (page: number) => {
    //get the exisiting query and replace the page number (?page=) with the new page number
    const query = searchData.query.replace(/(?<=page=)\d+/, page.toString());
    console.log(query);
    setIsLoading(true);
    try {
      const res = await axiosAuth.get(query);
      console.log(res.data);
      setSearchData({
        query: query,
        totalPages: res.data.totalPages,
        currentPage: page,
        hasNextPage: page + 1 < res.data.totalPages,
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
    <div className="flex items-center justify-center mt-3 space-x-1">
      <button
        className={cn(
          'flex items-center p-2 hover:bg-zinc-200 dark:hover:bg-[#26282c] text-black dark:text-zinc-300 text-[14px]',
          currentPage === 0 &&
            'cursor-not-allowed text-zinc-500 dark:text-zinc-500'
        )}
        disabled={currentPage === 0}
        onClick={() => {
          if (currentPage !== 0) {
            onPageButtonClick(currentPage - 1);
          }
        }}
      >
        <ChevronLeft className="w-4 h-4 font-bold mr-1" />
        Back
      </button>

      {/* render maximum 5 pages button */}

      {pageButtons.map((button) => {
        return (
          <button
            key={button.position}
            className={cn(
              'w-[28px] h-[28px] rounded-full text-black dark:text-white font-bold text-[14px]',
              button.value !== null && currentPage == button.value
                ? 'bg-indigo-500 text-white'
                : 'dark:hover:bg-[#232428] hover:bg-zinc-200'
            )}
            onClick={() => {
              if (button.value !== null) {
                onPageButtonClick(button.value);
              }
            }}
          >
            {button.text}
          </button>
        );
      })}

      <button
        className={cn(
          'flex items-center p-2 hover:bg-zinc-200 dark:hover:bg-[#26282c] text-black dark:text-zinc-300 text-[14px]',
          currentPage + 1 === totalPages &&
            'cursor-not-allowed text-zinc-300 dark:text-zinc-500'
        )}
        disabled={currentPage + 1 === totalPages}
        onClick={() => {
          if (currentPage + 1 !== totalPages) {
            onPageButtonClick(currentPage + 1);
          }
        }}
      >
        Next
        <ChevronRight className="w-4 h-4 font-bold ml-1" />
      </button>
    </div>
  );
};

export default Paginator;
