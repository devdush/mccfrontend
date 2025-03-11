import apiConfig from "../../config.json";
import httpService from "../httpService";

const apiEndpoint = `${apiConfig.apiURL}/customers/user`;

export function getCustomerByUserId(userId,token) {
    console.log(userId,token);
    
  return httpService.get(`${apiEndpoint}/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },

    withCredentials: true,
  });
}
