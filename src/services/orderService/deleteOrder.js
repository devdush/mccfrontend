import apiConfig from "../../config.json";
import httpService from "../httpService";

const apiEndpoint = `${apiConfig.apiURL}/orders`;

export function deleteOrder(id, token) {
    console.log(id, token);
    
  return httpService.delete(`${apiEndpoint}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },

    withCredentials: true,
  });
}
