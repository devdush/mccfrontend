import apiConfig from "../../config.json";
import httpService from "../httpService";

const apiEndpoint = `${apiConfig.apiURL}/orders`;

export function addOrder(obj, token) {
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
  addOrder,
};
