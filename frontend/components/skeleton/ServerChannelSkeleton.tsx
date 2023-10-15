import { Skeleton } from '@/components/ui/skeleton';

export default function ServerChannelSkeleton() {
  return (
    <div className="px-2 py-2 rounded-md w-full transition mb-3">
      <div className="mb-4 flex items-center">
        <Skeleton className="h-4 w-[20px] mr-2" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
      <div className="mb-4 flex items-center">
        <Skeleton className="h-4 w-[20px] mr-2" />
        <Skeleton className="h-4 w-[80px]" />
      </div>
      <div className="flex items-center">
        <Skeleton className="h-4 w-[20px] mr-2" />
        <Skeleton className="h-4 w-[170px]" />
      </div>
    </div>
  );
}
