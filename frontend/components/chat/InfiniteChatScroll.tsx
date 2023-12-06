import { cn } from '@/lib/utils';
import React, { useEffect } from 'react';

interface InfiniteChatScrollProps {
  children: React.ReactNode;
  topChild: any;
  bottomChild: any;
  isAtTop: boolean;
  isAtBottom: boolean;
  hasNext: boolean;
  hasPrev: boolean;
  getNext: () => any;
  getPrev: () => any;
  loader: React.ReactNode;
  className?: string;
}

const InfiniteChatScroll = ({
  children,
  topChild,
  bottomChild,
  isAtTop,
  isAtBottom,
  hasNext,
  hasPrev,
  getNext,
  getPrev,
  loader,
  className
}: InfiniteChatScrollProps) => {
  useEffect(() => {
    if (topChild && isAtTop && hasNext) {
      getNext();
    }
  }, [isAtTop, getNext, hasNext, topChild]);

  useEffect(() => {
    if (bottomChild && isAtBottom && hasPrev) {
      getPrev();
    }
  }, [isAtBottom, getPrev, hasPrev, bottomChild]);

  return (
    <div className={cn('flex flex-col-reverse', className)}>
      {/* {hasNext && <>{loader}</>} */}
      {children}
      {/* {hasPrev && <>{loader}</>} */}
    </div>
  );
};

export default InfiniteChatScroll;
