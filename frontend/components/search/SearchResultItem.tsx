import React from 'react';
import UserAvatar from '../UserAvatar';
import TooltipActions from '../TooltipActions';
import { getRoleIcon } from '@/utils/constants';
import { format } from 'date-fns';

const SearchResultItem = () => {
  return (
    <div className="bg-[#313338] hover:bg-zinc-700/50 rounded-md p-3 mb-2 cursor-pointer">
      <div className="flex gap-x-2 w-full relative items-start">
        <div className="min-w-[48px]">
          <div>
            <UserAvatar
              src={''}
              username={'Mitty'}
              avatarFallbackClassName="text-[15px]"
            />
          </div>
        </div>
        <div className="flex flex-col w-full overflow-x-hidden">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p className="font-semibold text-sm">
                <span className="text-white">Mitty</span>
              </p>
              <TooltipActions label={'Admin'}>
                <p className="ml-1">
                  {getRoleIcon('h-4 w-4')['Admin' as keyof typeof getRoleIcon]}
                </p>
              </TooltipActions>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-1">
                {/* 05/12/2022 10:30 PM */}
                {/* {format(new Date(message.createdAt), 'MM/dd/yyyy hh:mm a')} */}
                05/12/2022 10:30 PM
              </span>
            </div>
          </div>
          <div className="text-black dark:text-zinc-300 text-sm">
            They sent me the skin through support (glock-18). I waited a 3
            months and a half
            <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
              (edited)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultItem;
