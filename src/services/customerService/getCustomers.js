import apiConfig from "../../config.json";
import httpService from "../httpService";

const apiEndpoint = `${apiConfig.apiURL}/customers/all`;

export function getCustomers(token) {
  return httpService.get(apiEndpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },

    withCredentials: true,
  });
}
