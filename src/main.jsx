import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import {
  CssBaseline,
  Experimental_CssVarsProvider as CssVarsProvider,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./themes/theme";
import router from "./routes/router";
import "./index.css";
import { AuthProvider } from "./contexts/AuthProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { RecoilRoot } from "recoil";
import { SocketContextProvider } from "./contexts/SocketContext";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RecoilRoot>
      <GoogleOAuthProvider clientId={CLIENT_ID}>
        <CssVarsProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
              <SocketContextProvider>
                <RouterProvider router={router} />
              </SocketContextProvider>
            </AuthProvider>
          </ThemeProvider>
        </CssVarsProvider>
      </GoogleOAuthProvider>
    </RecoilRoot>
  </React.StrictMode>
);
