'use client';

import React, { useState, useContext } from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogDescription
} from '../ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger
} from '../ui/dropdown-menu';
import { useModal } from '@/hooks/useModal';
import { ScrollArea } from '../ui/scroll-area';
import UserAvatar from '../UserAvatar';
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MemberRole, getRoleIcon } from '@/utils/constants';
import Member from '@/types/Member';
import { useToast } from '../ui/use-toast';
import useAxiosAuth from '@/hooks/useAxiosAuth';
import { refetchContext } from '../providers/RefetchProvider';

// const roleIconMap = {
//     'Member': null,
//     'Moderator': <ShieldCheck className='h-4 w-4 text-indigo-500'/>,
//     'Admin': <ShieldAlert className='h-4 w-4 text-rose-500'/>
// }

const ManageMembersModal = () => {
  const { type, isOpen, onOpen, onClose, data } = useModal();
  const [editingMemberId, setEditingMemberId] = useState('');
  const router = useRouter();
  const axiosAuth = useAxiosAuth();
  const { toast } = useToast();
  const { triggerRefetchComponents } = useContext(refetchContext);

  const isModalOpen = type === 'members' && isOpen;
  const { server, userId: adminId } = data;

  const changeRole = async (memberId: number, role: string) => {
    try {
      setEditingMemberId(memberId.toString());
      const res = await axiosAuth.put(
        `/servers/${server?.id}/change-role/${memberId}?adminId=${adminId}`,
        {
          role
        }
      );
      if (res.status == 200) {
        if (server) {
          server.users = server.users.map((member: Member) => {
            if (member.id === memberId) {
              member.role = role;
            }
            return member;
          });
          triggerRefetchComponents(['ServerSidebar']);
          onOpen('members', { server, userId: adminId });
          toast({
            title: "User's role changed!"
          });
        }
      } else {
        toast({
          title: 'Something went wrong',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.log(error);
    }
    setEditingMemberId('');
  };

  const kickMember = async (memberId: number) => {
    try {
      setEditingMemberId(memberId.toString());
      const res = await axiosAuth.delete(
        `/servers/${server?.id}/kick/${memberId}?adminId=${adminId}`
      );
      if (res.status == 200) {
        if (server) {
          server.users = server.users.filter((member: Member) => {
            if (member.id !== memberId) return member;
          });
          triggerRefetchComponents(['ServerSidebar']);
          onOpen('members', { server, userId: adminId });
          toast({
            title: 'User kicked from server!'
          });
        }
      } else {
        toast({
          title: 'Something went wrong',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.log(error);
    }
    setEditingMemberId('');
  };

  //TODO: add search bar here to search for members using name or email address

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-5 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.users.length} members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.users.map((member: Member) => (
            <div key={member.id} className="flex items-center gap-x-2 mb-6">
              <UserAvatar username={member.username} src={member.avatarUrl} />
              <div className="flex flex-col gap-y-1">
                <div className="text-xs font-semibold flex items-center gap-x-1">
                  {member.username}
                  {
                    getRoleIcon('h-4 w-4')[
                      member.role as keyof typeof getRoleIcon
                    ]
                  }
                </div>
                <p className="text-xs text-zinc-500">dummyemail@email.com</p>
              </div>
              {/* TODO: handle case to not render the div below if member is an admin  -> DONE*/}
              {server.ownerId !== member.id &&
                editingMemberId !== member.id.toString() && (
                  <div className="ml-auto text-xs">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="h-4 w-4 text-zinc-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <ShieldQuestion className="h-4 w-4 mr-2" />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent sideOffset={7}>
                              <DropdownMenuItem
                                onClick={() => changeRole(member.id, 'MEMBER')}
                              >
                                <Shield className="h-4 w-4 mr-2" />
                                Member
                                {member.role === 'MEMBER' && (
                                  <Check className="text-xs text-green-500 h-4 w-4 ml-3" />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  changeRole(member.id, 'MODERATOR')
                                }
                              >
                                <ShieldCheck className="h-4 w-4 mr-2" />
                                Moderator
                                {member.role === 'MODERATOR' && (
                                  <Check className="text-xs text-green-500 h-4 w-4 ml-3" />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => kickMember(member.id)}
                          className="text-rose-500"
                        >
                          <Gavel className="h-4 w-4 mr-2" />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {/* show loading icon for the member that is being edited */}
              {editingMemberId === member.id.toString() && (
                <Loader2 className="ml-auto h-4 w-4 animate-spin text-zinc-500" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ManageMembersModal;
