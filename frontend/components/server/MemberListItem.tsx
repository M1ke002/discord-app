import Member from '@/types/Member';
import UserAvatar from '../UserAvatar';

interface MemberListItem {
  member: Member;
}

const MemberListItem = ({ member }: MemberListItem) => {
  return (
    <div className="flex items-center w-full px-2 py-1 mb-1 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/60 transition rounded-md cursor-pointer">
      <UserAvatar
        src={member.avatarUrl}
        username={member.nickname}
        className="h-9 w-9 mr-3"
      />
      <p className="text-[14px] text-black font-semibold dark:text-zinc-400">
        {member.nickname}
      </p>
    </div>
  );
};

export default MemberListItem;
