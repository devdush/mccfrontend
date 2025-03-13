import apiConfig from "../../config.json";
import httpService from "../httpService";

const apiEndpoint = `${apiConfig.apiURL}/bookings`;

export function updateBookings(id, status, token) {
  return httpService.put(
    `${apiEndpoint}/${id}/status?status=${status}`,
    console.log(`${apiEndpoint}/${id}/status?status=${status}`),
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    { withCredentials: true }
  );
}
export default {
  updateBookings,
};
