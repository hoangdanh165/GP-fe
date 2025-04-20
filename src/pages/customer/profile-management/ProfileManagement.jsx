import * as React from "react";
import { Grid, Box } from "@mui/material";

import Profile from "./PersonalInformation";
import VehicleInformation from "./VehicleInformation";

const ProfileManagement = () => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
        display: "flex",
        gap: 2,
      }}
    >
      <Box sx={{ flex: "0 0 30%", display: "flex", flexDirection: "column" }}>
        <Profile />
      </Box>
      <Box sx={{ flex: "0 0 70%", display: "flex", flexDirection: "column" }}>
        <VehicleInformation />
      </Box>
    </Box>
  );
};

export default ProfileManagement;
