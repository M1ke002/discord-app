"use client"

import { Plus } from 'lucide-react'
import React from 'react'
import TooltipActions from '../TooltipActions'
import { useModal } from '@/hooks/useModal'

//button to add a server
const NavigationAction = () => {
  const {onOpen} = useModal();
  return (
    <div>
        <TooltipActions
          label='Add a server'
          side='right'
          align='center'
        >
          <button className="group items-center" onClick={() => onOpen('createServer')}>
              <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[20px]
                  transition-all overflow-hidden items-center justify-center bg-background 
                  dark:bg-neutral-700 group-hover:bg-emerald-500"
              >
                  <Plus className="group-hover:text-white transition text-emerald-500" size="25"/>
              </div>
          </button>
        </TooltipActions>
    </div>
  )
}

export default NavigationAction