import apiConfig from "../../config.json";
import httpService from "../httpService";

const apiEndpoint = `${apiConfig.apiURL}/drivers`;

export function deleteDriver(id, token) {
    console.log(id, token);
    
  return httpService.delete(`${apiEndpoint}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },

    withCredentials: true,
  });
}
