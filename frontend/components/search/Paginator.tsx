import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

const Paginator = () => {
  return (
    <div className="flex items-center justify-center mt-3 space-x-2">
      <button
        className="flex items-center p-2 hover:bg-[#26282c] dark:text-zinc-500 cursor-not-allowed"
        disabled
      >
        <ChevronLeft className="w-4 h-4 text-zinc-500 dark:text-zinc-500 font-bold mr-1" />
        Back
      </button>

      <button className="w-[28px] h-[28px] rounded-full bg-indigo-500 text-white font-bold">
        1
      </button>

      <button className="w-[28px] h-[28px] rounded-full hover:bg-[#232428] text-white font-bold">
        2
      </button>

      <button className="w-[28px] h-[28px] rounded-full hover:bg-[#232428] text-white font-bold">
        3
      </button>

      <button className="flex items-center p-2 hover:bg-[#26282c]">
        Next
        <ChevronRight className="w-4 h-4 text-zinc-500 dark:text-zinc-400 font-bold ml-1" />
      </button>
    </div>
  );
};

export default Paginator;
