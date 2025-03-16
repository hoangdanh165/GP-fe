import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { Button } from '@mui/material';
import { GoogleIcon } from '../pages/auth/sign-in/components/CustomIcons';

const SIGN_IN_WITH_GOOGLE_API = import.meta.env.VITE_SIGN_IN_WITH_GOOGLE_API;


const GoogleSignInButton = () => {
  const login = useGoogleLogin({
    onSuccess: async (response) => {
      console.log("Google Login Success:", response);
      try {
        const res = await axios.post(SIGN_IN_WITH_GOOGLE_API, {
          token: response.access_token,
        });
        
        console.log("Login Success:", res.data);
      } catch (error) {
        console.error("Google Login Failed:", error);
      }
    },
    onError: () => console.log("Google Login Failed"),
  });

  return (
    <Button
      fullWidth
      variant="outlined"
      onClick={() => login()}
      startIcon={<GoogleIcon />}
    >
      Sign in with Google
    </Button>
  );
};

export default GoogleSignInButton;
