import apiConfig from "../../config.json";
import httpService from "../httpService";

const apiEndpoint = `${apiConfig.apiURL}/orders`;

export function getOrders(token) {
  return httpService.get(apiEndpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },

    withCredentials: true,
  });
}
