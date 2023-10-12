import { useSession } from "next-auth/react";
import { useEffect } from "react";

interface RefreshTokenHandlerProps {
    setInterval: (num: number) => void;
  }

const RefreshTokenHandler = ({setInterval}: RefreshTokenHandlerProps) => {
    const { data: session } = useSession();

    useEffect(() => {
        if(!!session) {
            // console.log(session.accessTokenExpiryDate, typeof session.accessTokenExpiryDate)
            // We did set the token to be ready to refresh after 45 seconds, here we set interval of 50 seconds.
            const secondsRemaining = Math.round((((session.accessTokenExpiryDate * 1000 - 10 * 1000) - Date.now()) / 1000));
            console.log(`Setting interval to ${secondsRemaining} seconds`);
            setInterval(secondsRemaining > 0 ? secondsRemaining : 0);
        }
    }, [session]);

    return null;
}

export default RefreshTokenHandler;