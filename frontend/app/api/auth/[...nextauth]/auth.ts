import CredentialsProvider from 'next-auth/providers/credentials';
import axios from '@/lib/axiosConfig';

const getTokenExpirationDate = (token: string) => {
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

const refreshToken = async (token: any) => {
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

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        if (!credentials) {
          return null;
        }
        const payload = {
          username: credentials.username,
          password: credentials.password
        };
        console.log(payload);
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
    async jwt({ token, user, trigger, session }: any) {
      console.log('===================> JWT CALLBACK <===================');
      if (trigger === 'update') {
        console.log('UPDATE!!!!');
        if (session.username) {
          token.username = session.username;
        }
        if (session.nickname) {
          token.nickname = session.nickname;
        }

        //if user doesnt have avatar yet and session has avatar
        if (!token.file && session.fileUrl) {
          token.file = {
            fileUrl: session.fileUrl,
            fileName: session.fileName,
            fileKey: session.fileKey
          };
        } else if (token.file && session.fileUrl) {
          token.file.fileUrl = session.fileUrl;
          token.file.fileName = session.fileName;
          token.file.fileKey = session.fileKey;
        } else if (token.file && !session.fileUrl) {
          token.file = null;
        }

        return token;
      }

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
          file: user.file,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpiryDate: getTokenExpirationDate(user.accessToken)
        };
      }

      //get new token in advance 30 minutes before it expires
      //fetch interval is every 1 hour and 45 minutes
      //token expires in 2 hours
      const shouldRefreshTime = Math.round(
        token.accessTokenExpiryDate * 1000 - 30 * 60 * 1000 - Date.now()
      );
      console.log('should refresh time: ' + shouldRefreshTime);

      const dateNowInSeconds = new Date().getTime() / 1000;

      if (shouldRefreshTime > 0) {
        console.log(
          '============> DATE NOW: ' +
            new Date(dateNowInSeconds * 1000) +
            ' vs token exp date: ' +
            new Date(token.accessTokenExpiryDate * 1000) +
            ' expires in: ' +
            (token.accessTokenExpiryDate - dateNowInSeconds) / 60 +
            ' minutes'
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
    async session({ session, token }: any) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.nickname = token.nickname;
      session.user.file = token.file;
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

export default authOptions;
