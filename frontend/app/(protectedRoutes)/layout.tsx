'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import LoadingScreen from '@/components/LoadingScreen';

export default function ProtectedRoutes({
  children
}: {
  children: React.ReactNode;
}) {
  // console.log('useSession in protected routes');
  const { data: session, status } = useSession();
  const router = useRouter();
  // console.log('session in ProtectedRoutes: ' + JSON.stringify(session));

  useEffect(() => {
    // if (!session) {
    //   if (pathname !== "/login") {
    //     console.log('redirecting to login...' + pathname);
    //     router.replace("/login");
    //   }
    // }
    // check if the error has occurred
    if (session?.error === 'RefreshAccessTokenError') {
      // Sign out here
      console.log('signing out...');
      signOut({
        callbackUrl: 'http://localhost:3000/login?message=sessionExpired'
      });
    }
  }, [session?.error, router]);

  if (status === 'loading') {
    return <LoadingScreen />;
  } else if (status === 'authenticated') {
    // setShow(false);
    return <>{children}</>;
  }
}
