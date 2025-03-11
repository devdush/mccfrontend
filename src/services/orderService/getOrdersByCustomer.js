import apiConfig from "../../config.json";
import httpService from "../httpService";

const apiEndpoint = `${apiConfig.apiURL}/orders/customer`;

export function getOrdersByCustomerId(customerId,token) {
    console.log(userId,token);
    
  return httpService.get(`${apiEndpoint}/${customerId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },

    withCredentials: true,
  });
}
