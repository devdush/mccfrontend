import apiConfig from "../../config.json";
import httpService from "../httpService";

const apiEndpoint = `${apiConfig.apiURL}/bookings`;

export function getBookings(token) {
  return httpService.get(apiEndpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },

    withCredentials: true,
  });
}
