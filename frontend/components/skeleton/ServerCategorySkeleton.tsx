import { Skeleton } from '@/components/ui/skeleton';

export default function ServerCategorySkeleton() {
  return (
    <div className="flex items-center justify-between py-3">
      <Skeleton className="h-6 w-[150px] dark:bg-zinc-600" />
      <div className="flex items-center">
        <Skeleton className="h-6 w-[25px] mr-2 dark:bg-zinc-600" />
        <Skeleton className="h-6 w-[25px] dark:bg-zinc-600" />
      </div>
    </div>
  );
}
