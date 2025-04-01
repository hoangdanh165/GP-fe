import useAuth from "./useAuth";
import useAxiosPrivate from "./useAxiosPrivate";

const useLogout = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();

  const logout = async () => {
    localStorage.removeItem("persist");
    localStorage.removeItem("isLoggedIn");
    setAuth(null);

    try {
      axiosPrivate.post(
        "/api/v1/users/log-out/",
        {},
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};

export default useLogout;
