import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';

import router from './routes/router';
import './index.css';
import { AuthProvider } from './contexts/AuthProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <CssBaseline />
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
