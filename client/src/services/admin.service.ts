import axios from 'axios';
import Cookies from "js-cookie";


const token = Cookies.get("accessToken");
const baseUrl: string = import.meta.env.VITE_API_URL + '/admin';


export const createAccountService = async ({ name, email, password, address, role }: { name: string, email: string, password: string, address: string, role: string }) => {
    try {
        const response = await axios.post(`${baseUrl}/user`, {
            name,
            email,
            password,
            role,
            address
        },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        console.log("Response:", response);

        if (response.status === 201) {
            const { data } = response;
            console.log("Account created successfully:", data);
            return data;
        } else {
            throw new Error("Account creation failed");
        }
    } catch (error) {
        console.error("Account creation error:", error);
    }
}

export const getAllUsersService = async () => {
    try {
        const response = await axios.get(`${baseUrl}/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            const { data } = response;
            return data;
        } else {
            throw new Error("Failed to fetch users");
        }
    } catch (error) {
        console.error("Fetch users error:", error);
    }
}

export const getDashboardDetailsService = async () => {
    try {
        const response = await axios.get(`${baseUrl}/dashboard`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            const { data } = response;
            return data;
        } else {
            throw new Error("Failed to fetch dashboard details");
        }
    } catch (error) {
        console.error("Fetch dashboard details error:", error);
    }
}

export const createStoreService = async ({ name, address, userId }: { name: string, address: string, userId: string }) => {
    try {
        const response = await axios.post(`${baseUrl}/store`, { name, address, userId }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            const { data } = response;
            return data;
        } else {
            throw new Error("Failed to fetch dashboard details");
        }
    } catch (error) {
        console.error("Fetch dashboard details error:", error);
    }
}