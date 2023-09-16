"use client"
import React from 'react'

import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import TooltipActions from '../TooltipActions'

interface NavItemProps {
    id: string,
    imageUrl: string,
    name: string,

}

const NavItem = ({id, imageUrl, name}: NavItemProps) => {
    const router = useRouter();
    const params = useParams();

  return (
    <TooltipActions
        label={name}
        side='right'
        align='center'
    >
        <button
            onClick={()=>{
                router.push(`/servers/${id}`)
            }}
            className='group relative flex items-center'
        >   
            <div
                className={cn(
                    "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
                    params?.serverId !== id && "group-hover:h-[20px]",
                    params?.serverId === id ? "h-[36px]": "h-[8px]"
                )}
            />
            <div
                className={cn(
                    "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
                    params?.serverId === id && "text-primary rounded-[16px]"
                )}
            >
                <Image
                    fill
                    src={imageUrl}
                    alt='Channel'
                />
            </div>
        </button>
    </TooltipActions>
  )
}

export default NavItem