import * as React from "react";
import { Grid, Box, Stack, Typography } from "@mui/material";

import Profile from "./Profile";

const ProfileManagement = () => {
  return (
    <>
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
        <Profile />
      </Box>
    </>
  );
};

export default ProfileManagement;
