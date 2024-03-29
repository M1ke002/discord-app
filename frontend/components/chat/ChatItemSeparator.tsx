import { format } from 'date-fns';

const ChatItemSeparator = ({ date }: { date: string }) => {
  return (
    <div className="flex items-center mt-2 px-4 before:flex-1 before:border-t before:border-zinc-200 dark:before:border-zinc-700 gray-200 before:mt-0.5 after:flex-1 after:border-t dark:after:border-zinc-700 after:border-zinc-200 after:mt-0.5">
      <p className="text-xs text-[#5c5e66] dark:text-zinc-400 text-center mx-1 mb-0 font-semibold">
        {/* August 15, 2023 */}
        {format(new Date(date), 'MMMM dd, yyyy')}
      </p>
    </div>
  );
};

export default ChatItemSeparator;
