import Member from '@/types/Member';
import UserAvatar from '../UserAvatar';
import { cn } from '@/lib/utils';
import { MemberRole } from '@/utils/constants';

interface MemberListItem {
  member: Member;
}

const MemberListItem = ({ member }: MemberListItem) => {
  return (
    <div className="flex items-center w-full px-2 py-1 mb-1 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/60 transition rounded-md cursor-pointer">
      <UserAvatar
        src={member.avatarUrl}
        username={member.nickname}
        className="h-8 w-8 mr-3"
      />
      <p className="text-[14px] text-black font-semibold dark:text-zinc-400">
        <span
          className={cn(
            member.role === MemberRole.ADMIN
              ? 'text-rose-500'
              : member.role === MemberRole.MODERATOR
              ? 'text-indigo-500'
              : ''
          )}
        >
          {member.nickname}
        </span>
      </p>
    </div>
  );
};

export default MemberListItem;
