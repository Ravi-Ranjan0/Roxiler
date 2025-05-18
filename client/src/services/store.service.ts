import axios from 'axios';
import Cookies from "js-cookie";


const token = Cookies.get("accessToken");
const baseUrl: string = import.meta.env.VITE_API_URL + '/store';


export const getAllStores = async () => {
    try {
        const response = await axios.get(baseUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            }})
            console.log("Response from getAllStores:", response);
        return response.data;
    } catch (error) {
        console.log("Error while getting up the stores" , error);
    }
}