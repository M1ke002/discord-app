"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import axios from "@/lib/axiosConfig";
import { Session } from "next-auth";
import { getTokenFromHeader } from "@/utils/utils";

const useAxiosAuth = () => {
  const { data: session } = useSession();

  //function to set up the request interceptor
  const setUpRequestInterceptor = (session: Session | null) =>
    axios.interceptors.request.use(
      (config) => {
        //if the request header doesn't contain the Authorization header
        //and the user is logged in (have the jwt access token) -> add the Authorization header to every request
        if (session?.accessToken) {
          if (!config.headers.Authorization || getTokenFromHeader(config.headers.Authorization.toString()) !== session.accessToken)
            config.headers.Authorization = `Bearer ${session.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

  useEffect(() => {
    const request = setUpRequestInterceptor(session);

    //cleanup function to remove the interceptor when the component unmounts
    return () => {
      axios.interceptors.request.eject(request);
    };
  }, [session]);

  return axios;
};

export default useAxiosAuth;

//TODO: bug -> session depedency in useEffect causes infinite loop of API requests and updating session
