import { Skeleton } from '@/components/ui/skeleton';
import ServerCategorySkeleton from './ServerCategorySkeleton';
import ServerChannelSkeleton from './ServerChannelSkeleton';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';

export default function ServerSidebarSkeleton() {
  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[color:var(--sidebar-dark)] bg-[color:var(--sidebar-light)]">
      {/* ServerHeader part */}
      <div className="flex items-center w-full text-md font-semibold px-3 h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
        <Skeleton className="h-5 w-[230px] dark:bg-zinc-600" />
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          {/* ServerSearch */}
          <div className="px-2 py-2 rounded-md flex items-center gap-x-2 w-full transition h-[36px]">
            {/* <Search className='h-4 w-4 text-zinc-500 dark:text-zinc-400'/> */}
            <Skeleton className="h-4 w-[20px] mr-1" />
            <Skeleton className="h-4 w-[150px]" />
            {/* <Skeleton className="h-4 w-[200px]" />
                <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">Search</p> */}
          </div>

          <Separator className="bg-zinc-200 dark:bg-zinc-700 my-2 rounded-md" />

          <ServerCategorySkeleton />
          <ServerChannelSkeleton />

          <ServerCategorySkeleton />
          <ServerChannelSkeleton />

          <ServerCategorySkeleton />
          <ServerChannelSkeleton />
        </div>
      </ScrollArea>

      {/* User account */}
      <div className="mt-auto flex items-center px-2 py-2 bg-[#e9ebee] dark:bg-[#252529]">
        <div className="flex items-center">
          <Skeleton className="rounded-full h-8 w-8 mr-2 dark:bg-zinc-700" />
          <div className="flex flex-col">
            <Skeleton className="h-3 w-[150px] mb-2 dark:bg-zinc-700" />
            <Skeleton className="h-3 w-[100px] dark:bg-zinc-700" />
          </div>
        </div>
      </div>
    </div>
  );
}
