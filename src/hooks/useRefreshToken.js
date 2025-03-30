import useAuth from "./useAuth";
import axios from "../services/axios";
const REFRESH_URL = "/api/v1/users/refresh/";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await axios.post(
        REFRESH_URL,
        {},
        { withCredentials: true }
      );

      setAuth((prev) => {
        return {
          ...prev,
          role: response.data.role,
          accessToken: response.data.accessToken,
          avatar: response.data.avatar,
          status: response.data.status,
          fullName: response.data.fullName,
          email: response.data.email,
          userId: response.data.userId,
        };
      });
      return response.data.accessToken;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("isLoggedIn");
      }
      throw error;
    }
  };

  return refresh;
};

export default useRefreshToken;
