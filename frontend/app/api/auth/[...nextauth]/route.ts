import NextAuth from 'next-auth';
import authOptions from './auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

//BUG: access token not updated for first few requests
