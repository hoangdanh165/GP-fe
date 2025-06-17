import * as React from "react";
import { Box } from "@mui/material";

import Profile from "./PersonalInformation";

const AdminProfileManagement = () => {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Box
        sx={{
          width: 700,
          display: "flex",
          flexDirection: "column",

          p: 2,
        }}
      >
        <Profile />
      </Box>
    </Box>
  );
};

export default AdminProfileManagement;
