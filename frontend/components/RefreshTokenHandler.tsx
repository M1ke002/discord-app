import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

interface RefreshTokenHandlerProps {
  setInterval: (num: number) => void;
}

const RefreshTokenHandler = ({ setInterval }: RefreshTokenHandlerProps) => {
  const { data: session } = useSession();

  useEffect(() => {
    if (!!session) {
      // console.log(session.accessTokenExpiryDate, typeof session.accessTokenExpiryDate)
      // We did set the token to be ready to refresh after 1h30 minutes, here we set interval of 1h45 minutes
      const secondsRemaining = Math.round(
        (session.accessTokenExpiryDate * 1000 - 60 * 15 * 1000 - Date.now()) /
          1000
      );
      console.log(`Setting interval to ${secondsRemaining} seconds`);
      setInterval(secondsRemaining > 0 ? secondsRemaining : 0);
    }
  }, [session]);

  return null;
};

export default RefreshTokenHandler;
