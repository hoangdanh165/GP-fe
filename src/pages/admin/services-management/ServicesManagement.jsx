import * as React from "react";
import { Grid, Box, Stack, Typography } from "@mui/material";
import UsersTable from "./components/ServicesTable";

const ServicesManagement = () => {
  return (
    <>
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "1.5rem", sm: "1.5rem", md: "2rem" },
            textAlign: "center",
            mb: 2,
          }}
        >
          Services Management
        </Typography>
        <UsersTable />
      </Box>
    </>
  );
};

export default ServicesManagement;
