import axios from 'axios';
import Cookies from "js-cookie";

const baseUrl : string = import.meta.env.VITE_API_URL + '/auth';

export const loginService = async ({email , password} : {email : string , password : string }) => {
    try {
        const response = await axios.post(`${baseUrl}/login`, {
            email,
            password,
        })

        if (response.status === 200) {
            const { data } = response;
            console.log("Login successful:", data);
            const accessToken = data?.data?.accessToken;
            Cookies.remove("accessToken");
            Cookies.set("accessToken", accessToken, { secure: true, sameSite: "Strict" });
            return data?.data;
        } else {
            throw new Error("Login failed");
        }
    } catch (error) {
        console.error("Login error:", error);
    }
}

export const logoutService = async () => {
    try {
        const token = Cookies.get("accessToken");

        if (!token) {
            console.error("No access token found");
            return;
        }

        const response = await axios.post(`${baseUrl}/logout`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            console.log("Logout successful");
            Cookies.remove("accessToken");
        } else {
            throw new Error("Logout failed");
        }
    } catch (error) {
        console.error("Logout error:", error);
        
    }
}

export const signupService = async ({name, email , password , address , role} : {name : string , email : string , password : string , address : string , role : string}) => {
    try {
        const response = await axios.post(`${baseUrl}/signup`, {
            name,
            email,
            password,
            role,
            address
        })

        if (response.status === 200) {
            const { data } = response;
            console.log("Signup successful:", data);
            return data;
        } else {
            throw new Error("Signup failed");
        }
    } catch (error) {
        console.error("Signup error:", error);
    }
}


