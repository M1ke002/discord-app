import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import React from 'react';
import Navbar from './navigation/Navbar';
import ServerSidebar from './server/ServerSidebar';

const MobileToggle = ({ serverId }: { serverId: string }) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden">
        <Menu className="mr-3" />
      </SheetTrigger>
      {/* why here doesnt need padding left 72px to work but in layout.tsx need padding for navbar??? */}
      <SheetContent side="left" className="p-0 flex gap-0">
        <div className="w-[72px]">
          <Navbar />
        </div>
        <ServerSidebar serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileToggle;
