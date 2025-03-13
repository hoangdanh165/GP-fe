import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';

import router from './routes/router';
import './index.css';
import { AuthProvider } from './contexts/AuthProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>


    <CssBaseline />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>


  </React.StrictMode>
);
