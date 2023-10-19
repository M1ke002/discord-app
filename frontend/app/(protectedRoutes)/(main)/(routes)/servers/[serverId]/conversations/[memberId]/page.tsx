'use client';

import React from 'react';
import { useEffect } from 'react';
import { useChatHeaderData } from '@/hooks/zustand/useChatHeaderData';

const page = () => {
  const { setChatHeaderData } = useChatHeaderData();

  useEffect(() => {
    console.log('in conversation page');
    setChatHeaderData('user name', 'conversation');
  }, []);

  return <div className="h-full w-full">Conversation page</div>;
};

export default page;
