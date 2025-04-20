import * as React from "react";
import { Box, Paper, Typography } from "@mui/material";
import VehiclesTable from "./VehicleTable";

export default function VehicleInformation() {
  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h5" mb={2}>
          Vehicle Information
        </Typography>
        <Box sx={{ height: "100%", width: "100%" }}>
          <VehiclesTable />
        </Box>
      </Paper>
    </Box>
  );
}
