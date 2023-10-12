// "use client";
// import { useEffect } from "react";
import { axiosAuth } from "@/lib/axiosConfig";
import axios from "@/lib/axiosConfig";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "./useCurrentUser";

const useAxiosAuth = () => {
  const router = useRouter();
  const currentUser = useCurrentUser();
  console.log("currentUser: " + JSON.stringify(currentUser));
  // const refreshToken = useRefreshToken();

  //function to set up the request interceptor
  // const setUpRequestInterceptor = () =>
    axiosAuth.interceptors.request.use(
      (config) => {
        //if the request header doesn't contain the Authorization header
        //and the user is logged in (have the jwt access token) -> add the Authorization header to every request
        if (!config.headers.Authorization && currentUser?.accessToken) {
          config.headers.Authorization = `Bearer ${currentUser?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

  //function to set up the response interceptor
  // const setUpResponseInterceptor = () =>
    axiosAuth.interceptors.response.use(
      (response) => {
        // console.log("response url: " + response.config.url);
        console.log("IN response interceptor success");
        console.log("access token success: " + currentUser?.accessToken);
        //for successful response, just return the response
        // Any status code that lie within the range of 2xx cause this function to trigger
        return response;
      },
      async (error) => {
        // console.log("ERROR received: " + JSON.stringify(error.config));
        const prevRequest = error.config;

        if (
          !error.response ||
          error.response.status !== 401 ||
          prevRequest._retry
        ) {
          return Promise.reject(error);
        }
        prevRequest._retry = true;
        try {
          const response = await axios.post("/auth/refreshToken", {
            refreshToken: currentUser?.refreshToken,
          });
          if (!response.data) return Promise.reject(error);
          console.log("IN response interceptor 401");

          const updatedUser = response.data;

          // console.log("response ERROR url: " + error.config.url);
          // console.log("access token before: " + refreshedSession?.accessToken);
          //call the refreshToken function to refresh the jwt access token
          // console.log("CALLED REFRESH TOKEN API");
          // const res = await axios.post("/auth/refreshToken", {
          //   refreshToken: refreshedSession?.refreshToken,
          // });
          prevRequest.headers[
            "Authorization"
          ] = `Bearer ${updatedUser?.accessToken}`;
          Cookies.set("currentUser", JSON.stringify(updatedUser));
          return axiosAuth(prevRequest);
        } catch (error) {
          console.log("error in responseInterceptor: " + error);
          console.log("REFRESH TOKEN EXPIRED! SIGNING OUT...");
          Cookies.remove("currentUser");
          //logout the user if the refresh token has expired
          router.push("/login");
          return Promise.reject(error);
        }
      }
    );

  // useEffect(() => {
  //   console.log("CALLEDDDDDDDDDDD!"); //BUG: called too many times
  //   const request = setUpRequestInterceptor();
  //   const response = setUpResponseInterceptor();

  //   //cleanup function to remove the interceptor when the component unmounts
  //   return () => {
  //     axiosAuth.interceptors.request.eject(request);
  //     axiosAuth.interceptors.response.eject(response);
  //   };
  // }, []);

  // const refreshToken = async (prevRequest) => {
  //   const refreshToken = session?.refreshToken;
  //   if (!refreshToken) {
  //     console.log("No refresh token found");
  //     signOut();
  //     return;
  //   }
  //   try {
  //     console.log("CALLED REFRESH TOKEN API");
  //     const res = await axios.post("/auth/refreshToken", {
  //       refreshToken: refreshToken,
  //     });
  //     if (session) {
  //       await update({
  //         ...session,
  //         user: {
  //           ...session.user,
  //         },
  //         accessToken: res.data.accessToken,
  //         refreshToken: res.data.refreshToken,
  //       });
  //     }
  //     prevRequest.headers["Authorization"] = `Bearer ${res.data.accessToken}`;
  //     // console.log("access token after: " + res.data.accessToken);
  //     console.log("prevRequest: " + JSON.stringify(prevRequest));
  //     // return axiosAuth(prevRequest);
  //     return;
  //   } catch (error) {
  //     console.log(error);
  //     signOut();
  //     return;
  //   }
  // };

  //return the axios instance with the interceptor
  return axiosAuth;
};

export default useAxiosAuth;

