import axios from "axios";
import { redirect } from "next/navigation";

const BASE_URL = "http://localhost:8080/api/v1";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => {
    // console.log("response url: " + response.config.url);
    console.log("IN response interceptor success");
    //for successful response, just return the response
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  async (error) => {
    console.log('IN response interceptor error: ' + error)
    const prevRequest = error.config;
    const componentType = typeof window !== "undefined" ? "client" : "server";

    if (
      !error.response ||
      error.response.status !== 401 ||
      prevRequest._retry
    ) {
      if (prevRequest._retry) {
        console.log("already retried, redirect to login...")
        if (componentType === "client") {
          window.location.replace("/login");
        } else {
          redirect("/login");
        }
      }
      return Promise.reject(error);
    }
    prevRequest._retry = true;
    let success = false;

    console.log("ACCESS TOKEN EXPIRED, REFRESHING TOKEN...")
    try {
      console.log('componentType: ' + componentType)
      let headers = null;
      //only add cookie header if it is a server request
      if (componentType === "server") {
        const { cookies } = await import("next/headers");
        headers = {
          "Content-type": "application/json",
          "Cookie": `refreshToken=${cookies().get("refreshToken")?.value}`,
        }
      } else {
        headers = {
          "Content-type": "application/json",
        }
      }
      const response = await axios.get(`${BASE_URL}/auth/refreshToken`, {
        withCredentials: true,
        headers: headers,
      })
      const result = response.data;
      // console.log('test:' + JSON.stringify(res.data));
      // const updatedUser = res.data;
      console.log("REFRESH TOKEN SUCCESSFUL!: " + JSON.stringify(result));
      success = true;
      //update the cookies in the previous request if it is a server request
      if (componentType === 'server') {
        prevRequest.headers.Cookie = `accessToken=${result?.accessToken}; refreshToken=${result?.refreshToken}; `;
        console.log('prev request headers: ' + JSON.stringify(prevRequest.headers));
      }
      return axiosInstance(prevRequest);
    } catch (error) {
      console.log("REFRESH TOKEN EXPIRED!: " + error);
    } finally {
      if (!success) {
        //logout the user
        console.log("LOGGING OUT...")
        if (componentType === "client") {
          window.location.replace("/login");
        } else {
          redirect("/login");
        }
      }
    }
  }
);


export default axiosInstance;