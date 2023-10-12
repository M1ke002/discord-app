"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoutes ({children} : {children: React.ReactNode}) {
  console.log('useSession in protected routes');
    const { data: session, status } = useSession();
    const router = useRouter();
    console.log('session in ProtectedRoutes: '+JSON.stringify(session));

  
    useEffect(() => {
      // if (!session) {
      //   if (pathname !== "/login") {
      //     console.log('redirecting to login...' + pathname);
      //     router.replace("/login");
      //   }
      // }
      // check if the error has occurred
      if (session?.error === "RefreshAccessTokenError") {
          // Sign out here
          console.log('signing out...');
          signOut();
      }
    }, [session?.error, router]);

    if (status === "loading") {
      return <div>LOADING...</div>;
    }
  
    if (status === "authenticated") {
      return (
        <>{children}</>
      );
    }
  }