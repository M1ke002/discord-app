import React from 'react';
import TooltipActions from '../TooltipActions';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Video, VideoOff } from 'lucide-react';

const VideoCallButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isVideoCall = searchParams.get('videoCall');

  const Icon = isVideoCall ? VideoOff : Video;

  const handleVideoCall = () => {
    const searchQuery = isVideoCall ? '' : '?videoCall=true';
    const url = pathname + searchQuery;
    console.log(url);
    router.push(url);
  };

  return (
    <TooltipActions
      label={isVideoCall ? 'End video call' : 'Start video call'}
      side="bottom"
      align="center"
    >
      <Icon
        className="w-5 h-5 mr-4 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition cursor-pointer"
        onClick={handleVideoCall}
      />
    </TooltipActions>
  );
};

export default VideoCallButton;
