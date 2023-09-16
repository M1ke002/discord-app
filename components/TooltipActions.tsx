import React from 'react'
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from './ui/tooltip'

interface TooltipActionsProps {
    children: React.ReactNode,
    label: string,
    side?: "top" | "bottom" | "left" | "right"
    align?: "start" | "center" | "end"
}

const TooltipActions = ({label, children, side, align}: TooltipActionsProps) => {
  return (
    <TooltipProvider>
        <Tooltip delayDuration={50}>
            <TooltipTrigger asChild>
                {children}
            </TooltipTrigger>
            <TooltipContent side={side} align={align}>
                <p className="font-semibold text-sm capitalize">{label.toLowerCase()}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  )
}

export default TooltipActions