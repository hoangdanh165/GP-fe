import { ReactElement } from 'react';
import { Box, Stack, useTheme, CircularProgress } from '@mui/material';
import React from 'react';

const PageLoader = (): ReactElement => {
  const theme = useTheme();
  return (
    <Stack
      width="100vw"
      height="100vh"
      justifyContent="center"
      alignItems="center"
      sx={{ position: "fixed", top: 0, left: 0, zIndex: 9999}}
    >
      <Box textAlign="center">
        <svg width={0} height={0}>
          <defs>
            <linearGradient id="page_loader_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={theme.palette.primary.main} />
              <stop offset="33%" stopColor={theme.palette.secondary.main} />
              <stop offset="67%" stopColor={theme.palette.info.main} />
              <stop offset="100%" stopColor={theme.palette.warning.main} />
            </linearGradient>
          </defs>
        </svg>
        <CircularProgress
          size={150}
          thickness={5}
          sx={{ 'svg circle': { stroke: `url(#page_loader_gradient)` } }}
        />
      </Box>
    </Stack>
  );
};

export default PageLoader;
