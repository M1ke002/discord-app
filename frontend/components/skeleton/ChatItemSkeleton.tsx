import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ChatItemSkeletonProps {
  variant: number;
}

export default function ChatItemSkeleton({ variant }: ChatItemSkeletonProps) {
  return (
    <div className="group flex flex-col items-center hover:bg-black/5 px-4 py-1 transition mt-4">
      <div className="flex gap-x-2 w-full relative items-start">
        <div className="min-w-[48px]">
          {/* Avatar skeleton */}
          <Skeleton className="h-10 w-10 rounded-full dark:bg-zinc-700" />
        </div>
        <div className="flex flex-col w-full overflow-x-hidden">
          {/* username skeleton */}
          <Skeleton
            className={cn(
              'h-4 w-[80px] dark:bg-zinc-600 mb-2',
              (variant == 1 || variant == 4) && 'w-[100px]',
              (variant == 2 || variant == 7) && 'w-[80px]',
              (variant == 3 || variant == 6) && 'w-[160px]',
              (variant == 5 || variant == 8) && 'w-[100px]'
            )}
          />
          {/* each line of message */}
          {variant == 1 && (
            <>
              <div className="flex items-center mb-2">
                <Skeleton className="h-4 w-[60px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[90px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[50px] dark:bg-zinc-700 mr-1" />
              </div>
              <div className="flex items-center mb-2">
                <Skeleton className="h-4 w-[50px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[60px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[40px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[80px] dark:bg-zinc-700 mr-1" />
              </div>
              <div className="flex items-center mb-2">
                <Skeleton className="h-4 w-[70px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[50px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[40px] dark:bg-zinc-700 mr-1" />
              </div>
            </>
          )}
          {variant == 2 && (
            <>
              <div className="flex items-center mb-2">
                <Skeleton className="h-4 w-[40px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[70px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[50px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[60px] dark:bg-zinc-700 mr-1" />
              </div>
            </>
          )}
          {variant == 3 && (
            <>
              <div className="flex items-center mb-2">
                <Skeleton className="h-4 w-[30px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[40px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[70px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[60px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[40px] dark:bg-zinc-700 mr-1" />
              </div>
              <div className="flex items-center mb-2">
                <Skeleton className="h-4 w-[80px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[30px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[50px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[50px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[70px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[70px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[80px] dark:bg-zinc-700 mr-1" />
              </div>
              {/* A long image skeleton */}
              <Skeleton className="h-72 w-[200px] dark:bg-zinc-600 mb-2" />
              <div className="flex items-center mb-2">
                <Skeleton className="h-4 w-[40px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[30px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[70px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[60px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[80px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[50px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[50px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[50px] dark:bg-zinc-700 mr-1" />
              </div>
            </>
          )}
          {variant == 4 && (
            <>
              <div className="flex items-center mb-2">
                <Skeleton className="h-4 w-[30px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[60px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[50px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[40px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[60px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[50px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[50px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[40px] dark:bg-zinc-700 mr-1" />
              </div>
            </>
          )}
          {variant == 5 && (
            <>
              <div className="flex items-center mb-2">
                <Skeleton className="h-4 w-[50px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[80px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[30px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[60px] dark:bg-zinc-700 mr-1" />
              </div>
              <div className="flex items-center mb-2">
                <Skeleton className="h-4 w-[70px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[40px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[60px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[50px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[60px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[70px] dark:bg-zinc-700 mr-1" />
              </div>
              <div className="flex items-center mb-2">
                <Skeleton className="h-4 w-[60px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[70px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[90px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[40px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[40px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[30px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[50px] dark:bg-zinc-700 mr-1" />
              </div>
              <div className="flex items-center mb-2">
                <Skeleton className="h-4 w-[80px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[50px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[70px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[30px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[50px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[90px] dark:bg-zinc-700 mr-1" />
              </div>
            </>
          )}
          {variant == 6 && (
            <>
              <div className="flex items-center mb-2">
                <Skeleton className="h-4 w-[70px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[40px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[60px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[50px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[60px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[70px] dark:bg-zinc-700 mr-1" />
              </div>
              <Skeleton className="h-32 w-80 dark:bg-zinc-600 mb-2" />
              <div className="flex items-center mb-2">
                <Skeleton className="h-4 w-[60px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[90px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[50px] dark:bg-zinc-700 mr-1" />
              </div>
              <div className="flex items-center mb-2">
                <Skeleton className="h-4 w-[50px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[60px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[40px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[80px] dark:bg-zinc-700 mr-1" />
              </div>
            </>
          )}
          {variant == 7 && (
            <>
              <div className="flex items-center mb-2">
                <Skeleton className="h-4 w-[70px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[50px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[40px] dark:bg-zinc-700 mr-1" />
              </div>
              <Skeleton className="h-[300px] w-72 dark:bg-zinc-600 mb-2" />
            </>
          )}
          {variant == 8 && (
            <>
              <div className="flex items-center mb-2">
                <Skeleton className="h-4 w-[70px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[40px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[60px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[50px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[60px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[70px] dark:bg-zinc-700 mr-1" />
              </div>
              <div className="flex items-center mb-2">
                <Skeleton className="h-4 w-[50px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[60px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[40px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[80px] dark:bg-zinc-700 mr-1" />
              </div>
              <div className="flex items-center mb-2">
                <Skeleton className="h-4 w-[70px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[50px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[40px] dark:bg-zinc-700 mr-1" />
              </div>
              <div className="flex items-center mb-2">
                <Skeleton className="h-4 w-[50px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[80px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[30px] dark:bg-zinc-700 mr-1" />
                <Skeleton className="h-4 w-[90px] dark:bg-zinc-700 mr-1" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
