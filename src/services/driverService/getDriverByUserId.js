import apiConfig from "../../config.json";
import httpService from "../httpService";

const apiEndpoint = `${apiConfig.apiURL}/drivers/user`;

export function getDriverByUserId(userId,token) {
    console.log("saddr",userId,token);
    
  return httpService.get(`${apiEndpoint}/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },

    withCredentials: true,
  });
}
