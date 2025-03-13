import apiConfig from "../../config.json";
import httpService from "../httpService";

const apiEndpoint = `${apiConfig.apiURL}/drivers`;

export function updateDriver(obj, token) {
  console.log(obj, token);
  return httpService.put(
    `${apiEndpoint}/${obj.id}`,
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
  updateDriver,
};
