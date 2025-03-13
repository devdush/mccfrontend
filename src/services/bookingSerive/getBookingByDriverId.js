import apiConfig from "../../config.json";
import httpService from "../httpService";

const apiEndpoint = `${apiConfig.apiURL}/bookings/driver`;

export function getBookingsByDriverId(userId,token) {
    console.log(userId,token);
    
  return httpService.get(`${apiEndpoint}/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },

    withCredentials: true,
  });
}
