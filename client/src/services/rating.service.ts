import axios from "axios"
import Cookies from "js-cookie"

const token = Cookies.get("accessToken")
const baseUrl: string = import.meta.env.VITE_API_URL

export const getStoreRatingsService = async (storeId: number) => {
  try {
    const response = await axios.get(`${baseUrl}/rating/${storeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data
  } catch (error) {
    console.error("Error while fetching store ratings", error)
    throw error
  }
}
