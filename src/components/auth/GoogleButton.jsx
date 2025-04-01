import { useGoogleLogin } from "@react-oauth/google";
import axios from "../../services/axios";
import { Button } from "@mui/material";
import { GoogleIcon } from "../../pages/auth/sign-in/components/CustomIcons";
import useAuth from "../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";

const SIGN_IN_WITH_GOOGLE_API = import.meta.env.VITE_SIGN_IN_WITH_GOOGLE_API;

const GoogleButton = ({
  buttonText = "Sign in with Google",
  setErrMsg,
  setSnackbarOpen,
}) => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await axios.post(SIGN_IN_WITH_GOOGLE_API, {
          token: response.access_token,
        });

        localStorage.setItem("isSignedIn", "true");
        const accessToken = res?.data?.accessToken;
        const role = res?.data?.role;
        const status = res?.data?.status;
        const avatar = res?.data?.avatar;
        const fullName = res?.data?.fullName;
        const userId = res?.data?.userId;

        setAuth({ email, role, status, accessToken, avatar, fullName, userId });
        navigate("/");
      } catch (error) {
        setErrMsg(buttonText + " failed!");
        setSnackbarOpen(true);
      }
    },
    ux_mode: "redirect",
    onError: () => {
      setErrMsg(buttonText + " failed!");
      setSnackbarOpen(true);
    },
  });

  return (
    <Button
      fullWidth
      variant="outlined"
      onClick={() => login()}
      startIcon={<GoogleIcon />}
    >
      {buttonText}
    </Button>
  );
};

export default GoogleButton;
