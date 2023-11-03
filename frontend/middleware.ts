import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export default async function middleware(
  req: NextRequest,
  event: NextFetchEvent
) {
  const token = await getToken({ req });
  const isAuthenticated = !!token;
  // console.log('isAuthenticated', isAuthenticated);
  // console.log('pathname', req.nextUrl.pathname)

  if (req.nextUrl.pathname.startsWith('/register') && !isAuthenticated) {
    //just let the user register
    return NextResponse.next();
  }

  if (
    req.nextUrl.pathname.startsWith('/login') ||
    req.nextUrl.pathname.startsWith('/register') ||
    req.nextUrl.pathname === '/'
  ) {
    if (isAuthenticated) {
      // console.log('redirecting to /');
      return NextResponse.redirect(new URL('/conversations', req.url));
    }
  }

  const authMiddleware = await withAuth({
    pages: {
      signIn: `/login`
    }
  });

  // @ts-expect-error
  return authMiddleware(req, event);
}

export const config = {
  // matcher: [
  //   // '/((?!_next|api/auth).*)(.+)'
  //   '/((?!_next|_next/static|_next/image|images|favicon.ico).*)(.+)'
  // ],
  matcher: [
    //allow all routes except /login and /register
    '/((?!_next/static|_next/image|images|favicon.ico).*)'
  ]
};

// export const config = {
//   // matcher: ["/private", "/"],
//   matcher: [
//     //allow all routes except /login and /register
//     // '/((?!_next|api/auth|login|register|_next/static|_next/image|images|favicon.ico).*)(.+)'
//     // '/((?!_next|api/auth).*)(.+)'
//     // '/((?!_next|api/auth|_next/static|_next/image|images|favicon.ico).*)(.+)'
//   ],
// };

//TODO: implement route handler which acts as a middleware to refresh token and set cookies
