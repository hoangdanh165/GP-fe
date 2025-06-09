import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import AppTheme from "../../../themes/shared-theme/AppTheme";
import ColorModeSelect from "../../../themes/shared-theme/ColorModeSelect";
import GoogleButton from "../../../components/auth/GoogleButton";
import { SitemarkIcon } from "./components/CustomIcons";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../../../services/axios";
import SnackbarNotification from "../../../components/utils/SnackbarNotification";

const SIGN_IN_URL = import.meta.env.VITE_SIGN_IN_URL;
const SIGN_UP_API = import.meta.env.VITE_SIGN_UP_API;

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "550px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

const SignUp = (props) => {
  const navigate = useNavigate();

  const [errMsg, setErrMsg] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [phoneErrorMessage, setPhoneErrorMessage] = useState("");
  const [addressError, setAddressError] = useState(false);
  const [addressErrorMessage, setAddressErrorMessage] = useState("");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setErrMsg("");
  };

  const validateInputs = () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const name = document.getElementById("name");
    const phone = document.getElementById("phone");
    const address = document.getElementById("address");

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (!name.value || name.value.length < 1) {
      setNameError(true);
      setNameErrorMessage("Name is required.");
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    if (!phone.value || phone.value.length < 1) {
      setPhoneError(true);
      setPhoneErrorMessage("Phone is required.");
      isValid = false;
    } else {
      setPhoneError(false);
      setPhoneErrorMessage("");
    }

    if (!address.value || address.value.length < 1) {
      setAddressError(true);
      setAddressError("Address is required.");
      isValid = false;
    } else {
      setAddressError(false);
      setAddressErrorMessage("");
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) {
      return;
    }
    const data = new FormData(event.currentTarget);
    console.log({
      name: data.get("name"),
      lastName: data.get("lastName"),
      email: data.get("email"),
      password: data.get("password"),
    });

    const originalPhone = data.get("phone").trim();
    const phone = originalPhone.startsWith("0")
      ? "+84" + originalPhone.slice(1)
      : originalPhone;

    try {
      const response = await axios.post(
        SIGN_UP_API,
        JSON.stringify({
          full_name: data.get("name").trim(),
          phone,
          address: data.get("address").trim(),
          email: data.get("email").trim(),
          password: data.get("password"),
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      alert(response.data.detail);
      navigate(SIGN_IN_URL);
    } catch (err) {
      console.log(err?.response);
      if (!err?.response) {
        setErrMsg("No responses from server!");
      } else if (err.response?.status === 400) {
        setErrMsg("User with this email already exists!");
      } else {
        setErrMsg("Sign up failed!");
      }
      setSnackbarOpen(true);
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Box
            component="img"
            src="/logo.png"
            alt="Logo"
            sx={{
              width: 150,
              height: 60,
              borderRadius: 2,
              boxShadow: 0,
              objectFit: "cover",
              alignSelf: "center",
            }}
          />
          <Typography
            component="h1"
            variant="h4"
            sx={{
              width: "100%",
              fontSize: "clamp(2rem, 10vw, 2.15rem)",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Stack direction="row" spacing={2}>
              <FormControl sx={{ flex: 6 }}>
                <FormLabel htmlFor="name">Full name</FormLabel>
                <TextField
                  autoComplete="name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  error={nameError}
                  helperText={nameErrorMessage}
                  color={nameError ? "error" : "primary"}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="phone">Phone</FormLabel>
                <TextField
                  autoComplete="phone"
                  name="phone"
                  required
                  fullWidth
                  id="phone"
                  error={phoneError}
                  helperText={phoneErrorMessage}
                  color={phoneError ? "error" : "primary"}
                />
              </FormControl>
            </Stack>
            <FormControl>
              <FormLabel htmlFor="address">Address</FormLabel>
              <TextField
                autoComplete="address"
                name="address"
                required
                fullWidth
                id="address"
                error={addressError}
                helperText={addressErrorMessage}
                color={addressError ? "error" : "primary"}
              />
            </FormControl>
            <Stack direction="row" spacing={2}>
              <FormControl sx={{ flex: 6 }}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <TextField
                  required
                  fullWidth
                  id="email"
                  name="email"
                  autoComplete="email"
                  variant="outlined"
                  error={emailError}
                  helperText={emailErrorMessage}
                  color={passwordError ? "error" : "primary"}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <TextField
                  required
                  fullWidth
                  name="password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  variant="outlined"
                  error={passwordError}
                  helperText={passwordErrorMessage}
                  color={passwordError ? "error" : "primary"}
                />
              </FormControl>
            </Stack>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              Sign up
            </Button>
          </Box>
          <Divider>
            <Typography sx={{ color: "text.secondary" }}>or</Typography>
          </Divider>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <GoogleButton
              buttonText="Sign up with Google"
              setErrMsg={setErrMsg}
              setSnackbarOpen={setSnackbarOpen}
            />
            <Typography sx={{ textAlign: "center" }}>
              Already have an account?{" "}
              <Link
                href={SIGN_IN_URL}
                variant="body2"
                sx={{ alignSelf: "center" }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Card>
        <SnackbarNotification
          open={snackbarOpen}
          message={errMsg}
          severity="error"
          onClose={handleSnackbarClose}
        />
      </SignUpContainer>
    </AppTheme>
  );
};

export default SignUp;
