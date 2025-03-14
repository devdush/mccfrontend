import { toast } from "react-toastify";
import { loginUser } from "../../services/auth/login";
import { useNavigate } from "react-router-dom";

export const LoginUser = (data) => {
  console.log(data);
  return async (dispatch) => {
    try {
      const response = await loginUser(data);
      console.log(response);
      if (response?.status === 200) {
        const user = response?.data?.user;
        const isAuthenticated = response?.data?.token ? true : false;

        const token = response.data.token;
        sessionStorage.setItem("token", JSON.stringify(token));
        sessionStorage.setItem("user", JSON.stringify(user));
        dispatch({
          type: "LOGIN_USER",
          user: user,
          isAuthenticated: isAuthenticated,
          isLoading: false,
          token: token,
        });

        toast.success("response.data.message");
       
        // window.location.href = "/customer/dashboard";
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error("Network error: Unable to reach the server.");
    }
  };
};
