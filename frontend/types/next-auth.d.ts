import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: number;
      username: string;
      nickname: string;
      avatarUrl: string | null;
    };
    accessToken: string;
    refreshToken: string;
    accessTokenExpiryDate: number;
    error?: 'RefreshAccessTokenError';
  }
}
