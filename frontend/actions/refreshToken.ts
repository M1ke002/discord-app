"use client";

import axios from "@/lib/axiosConfig"
import { redirect } from "next/navigation";
import Cookies from "js-cookie";


export const refreshToken = async (refreshToken: string) => {
    try {
        const res = await axios.post('/auth/refreshToken', {
            refreshToken
        });
        Cookies.set("currentUser", res.data);
        console.log("cookies: " + JSON.stringify(Cookies.get("currentUser")));
        return res.data;
    } catch (error) {
        console.log(error);
        console.log("REFRESH TOKEN EXPIRED! SIGNING OUT...");
        Cookies.remove("currentUser");
        redirect("/login");
    }
}