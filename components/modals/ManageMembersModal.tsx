"use client"

import React, { useState } from 'react'

import { Dialog, DialogTitle, DialogContent, DialogHeader, DialogDescription } from '../ui/dialog'
import { 
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal,
    DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuTrigger,
    DropdownMenuSubTrigger  } 
    from '../ui/dropdown-menu'
import { useModal } from '@/hooks/useModal'
import { ScrollArea } from '../ui/scroll-area'
import UserAvatar from '../UserAvatar'
import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react'
import { useRouter } from 'next/navigation'

const roleIconMap = {
    'Member': null,
    'Moderator': <ShieldCheck className='h-4 w-4 text-indigo-500'/>,
    'Admin': <ShieldAlert className='h-4 w-4 text-rose-500'/>
}

const ManageMembersModal = () => {
    const {type, isOpen, onOpen, onClose, data} = useModal();
    const [editingMemberId, setEditingMemberId] = useState("");
    const router = useRouter();

    const isModalOpen = type === "members" && isOpen;
    const {server} = data;

    const changeRole = async (memberId: string, role: string) => {
        setEditingMemberId(memberId);
        // const response = await axios.put(...)
        //update the server component with the new role
        router.refresh();
        // onOpen("members", {response.data});
        setEditingMemberId("");
    }

    const kickMember = async (memberId: string) => {
        setEditingMemberId(memberId);
        // const response = await axios.delete(...)
        //update the server component with the new role
        router.refresh();
        // onOpen("members", {response.data});
        setEditingMemberId("");
    }

    //TODO: add search bar here to search for members using name or email address

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black overflow-hidden">
                <DialogHeader className="pt-5 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">Manage members</DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        {server?.members.length} members
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className='mt-8 max-h-[420px] pr-6'>
                    {server?.members.map(member => (
                        <div key={member.profileId} className="flex items-center gap-x-2 mb-6">
                            <UserAvatar username={member.name} src={member.avatarUrl} />
                            <div className="flex flex-col gap-y-1">
                                <div className="text-xs font-semibold flex items-center gap-x-1">
                                    {member.name}
                                    {roleIconMap[member.role as keyof typeof roleIconMap]}
                                </div>
                                <p className="text-xs text-zinc-500">dummyemail@email.com</p>
                            </div>
                            {/* TODO: handle case to not render the div below if member is an admin */}
                            {editingMemberId !== member.profileId && (
                                <div className="ml-auto text-xs">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <MoreVertical className="h-4 w-4 text-zinc-500"/>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent side='left'>
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger className='flex items-center'>
                                                    <ShieldQuestion className='h-4 w-4 mr-2'/>
                                                    <span>Role</span>
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent sideOffset={7}>
                                                        <DropdownMenuItem onClick={() => changeRole(member.profileId, "Member")}>
                                                            <Shield className='h-4 w-4 mr-2'/>
                                                            Member
                                                            {member.role === 'Member' && (
                                                                <Check className='text-xs text-green-500 h-4 w-4 ml-3'/>
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => changeRole(member.profileId, "Moderator")}>
                                                            <ShieldCheck className='h-4 w-4 mr-2'/>
                                                            Moderator
                                                            {member.role === 'Moderator' && (
                                                                <Check className='text-xs text-green-500 h-4 w-4 ml-3'/>
                                                            )}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => kickMember(member.profileId)} className='text-rose-500'>
                                                <Gavel className='h-4 w-4 mr-2'/>
                                                Kick
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )}
                            {/* show loading icon for the member that is being edited */}
                            {editingMemberId === member.profileId && (
                                <Loader2 className="ml-auto h-4 w-4 animate-spin text-zinc-500"/>
                            )}
                        </div>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

export default ManageMembersModal