import apiConfig from "../../config.json";
import httpService from "../httpService";

const apiEndpoint = `${apiConfig.apiURL}/orders`;

export function updateOrder(obj, token,id) {
  console.log(obj, token);
  return httpService.put(
    `${apiEndpoint}/${id}`,
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
  updateOrder,
};
