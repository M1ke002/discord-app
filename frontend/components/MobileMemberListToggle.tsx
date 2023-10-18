import { Users } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import React from 'react';
import MemberList from './server/MemberList';

const MobileMemberListToggle = ({ serverId }: { serverId: string }) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden">
        <Users className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
      </SheetTrigger>
      {/* why here doesnt need padding left 72px to work but in layout.tsx need padding for navbar??? */}
      <SheetContent side="right" className="p-0 flex gap-0">
        <MemberList serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileMemberListToggle;
