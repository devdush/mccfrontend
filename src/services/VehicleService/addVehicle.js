import apiConfig from "../../config.json";
import httpService from "../httpService";

const apiEndpoint = `${apiConfig.apiURL}/vehicles/add`;

export function addVehicle(type,obj, token) {
  console.log(type, obj, token);
  return httpService.post(
    `${apiEndpoint}/${type}`,
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
  addVehicle,
};
