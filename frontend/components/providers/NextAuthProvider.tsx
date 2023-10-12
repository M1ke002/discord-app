'use client'

import { SessionProvider } from "next-auth/react"
import { useState } from 'react';
import RefreshTokenHandler from "../RefreshTokenHandler";

export default function AuthProvider ({
  children,
  // session,
}: {
  children: React.ReactNode
  // session: any,
}): React.ReactNode {
  const [interval, setInterval] = useState(0);

  return <SessionProvider refetchInterval={interval} refetchOnWindowFocus={true}>
    {children}
    <RefreshTokenHandler setInterval={(seconds: number) => {setInterval(seconds)}} />
  </SessionProvider>
}