import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from '@/lib/axiosConfig';

const getTokenExpirationDate = (token) => {
  //input is the jwt access token string
  if (!token) {
    return null;
  }
  const tokenParsed = JSON.parse(
    Buffer.from(token.split('.')[1], 'base64').toString()
  );
  console.log('token parsed: ' + JSON.stringify(tokenParsed));
  return tokenParsed.exp;
};

const refreshToken = async (token) => {
  console.log('old access token: ' + token.accessToken);
  const refreshToken = token?.refreshToken;
  if (!refreshToken) {
    console.log('No refresh token found');
    return {
      ...token,
      error: 'RefreshAccessTokenError'
    };
  }
  try {
    console.log('CALLED REFRESH TOKEN API');
    const res = await axios.post('/auth/refreshToken', {
      refreshToken: refreshToken
    });
    return {
      ...token,
      accessToken: res.data.accessToken,
      refreshToken: res.data.refreshToken,
      accessTokenExpiryDate: getTokenExpirationDate(res.data.accessToken)
    };
  } catch (error) {
    console.log('========> refresh token expired! ' + error);
    console.log(JSON.stringify({ ...token, error: 'RefreshAccessTokenError' }));
    return {
      ...token,
      error: 'RefreshAccessTokenError'
    };
  }
};

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      async authorize(credentials, req) {
        const payload = {
          username: credentials.username,
          password: credentials.password
        };
        console.log(payload);
        // const res = await fetch(`${AUTH_API_URL}/login`, {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify(payload),
        // });
        const res = await axios.post('/auth/login', payload);
        const user = res.data;
        console.log('LOGGED IN: ' + JSON.stringify(user));

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log('===================> JWT CALLBACK <===================');
      // if (trigger === "update") {
      //   console.log("UPDATE!!!!");
      //   return {
      //     ...token,
      //     accessToken: session.accessToken,
      //     refreshToken: session.refreshToken,
      //   };
      // }

      const now = Date.now();
      const prev = token.now ?? now;
      token.now = now;
      const diff = token.now - prev;
      console.log(diff / 1000, 'seconds');

      //first time sign in
      if (user) {
        console.log('first time sign in');
        //The account refers to the authentication provider
        // console.log("ACCOUNT: " + JSON.stringify(account));
        return {
          ...token,
          id: user.userId,
          username: user.username,
          nickname: user.nickname,
          avatarUrl: user.avatarUrl,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpiryDate: getTokenExpirationDate(user.accessToken)
        };
      }

      const shouldRefreshTime = Math.round(
        token.accessTokenExpiryDate * 1000 - 15 * 1000 - Date.now()
      );
      console.log('should refresh time: ' + shouldRefreshTime);

      const dateNowInSeconds = new Date().getTime() / 1000;
      //get new token in advance 15 seconds before it expires
      //fetch interval is every 50 seconds
      //token expires in 60 seconds
      // if (dateNowInSeconds + 15 < token.accessTokenExpiryDate) {
      if (shouldRefreshTime > 0) {
        console.log(
          '============> DATE NOW: ' +
            new Date(dateNowInSeconds * 1000) +
            ' vs token exp date: ' +
            new Date(token.accessTokenExpiryDate * 1000) +
            ' expires in: ' +
            (token.accessTokenExpiryDate - dateNowInSeconds) +
            ' seconds'
        );
        return token;
      }

      console.log(
        '============> access token about to expire, getting new one'
      );
      console.log(
        '============> DATE NOW: ' +
          new Date(dateNowInSeconds * 1000) +
          ' vs token exp date: ' +
          new Date(token.accessTokenExpiryDate * 1000) +
          ' expires in: ' +
          (token.accessTokenExpiryDate - dateNowInSeconds) +
          ' seconds'
      );
      const newToken = await refreshToken(token);
      console.log('new token: ' + JSON.stringify(newToken));
      return newToken;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.nickname = token.nickname;
      session.user.avatarUrl = token.avatarUrl;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.accessTokenExpiryDate = token.accessTokenExpiryDate;
      session.error = token.error;
      console.log(session);
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login'
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

//BUG: access token not updated for first few requests
