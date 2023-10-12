import axios from "@/lib/axiosConfig";
import Cookies from "js-cookie";

interface SignInAction {
    username: string;
    password: string;
}

export const signIn = async ({username, password}: SignInAction) => {
    try {
        const res = await axios.post('/auth/login', {
            username,
            password
        });
        Cookies.set("currentUser", JSON.stringify(res.data));
        return {
        success: true,
        message: ""
        };
      } catch (error) {
        console.log(error);
        return {
          success: false,
          message: "Login failed"
        };
      }
}