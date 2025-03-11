import apiConfig from "../../config.json";
import httpService from "../httpService";

const apiEndpoint = `${apiConfig.apiURL}/user/register`;
console.log(apiEndpoint);
export function registerUser(obj) {
    console.log(obj);
    
  return httpService.post(
    apiEndpoint,
    obj,
    { withCredentials: true }
  );
}
export default {
  registerUser,
};
