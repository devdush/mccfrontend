import apiConfig from "../../config.json";
import httpService from "../httpService";

const apiEndpoint = `${apiConfig.apiURL}/bookings`;

export function addBooking(obj, token) {
  console.log(obj, token);
  return httpService.post(
    apiEndpoint,
    obj,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    { withCredentials: true }
  );
}
export default {
  addBooking,
};
