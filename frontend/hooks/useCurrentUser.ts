"use client";
import { useState, useEffect } from "react"
import { User } from "@/types/User"
import Cookies from "js-cookie"

export const useCurrentUser = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const currentUser = Cookies.get("currentUser");
        if (currentUser) {
            setUser(JSON.parse(currentUser));
        }
    }, [])

    return user;
}