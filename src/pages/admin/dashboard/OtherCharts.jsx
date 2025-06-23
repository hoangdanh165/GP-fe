import React, { useEffect, useState } from "react";
import { Box, Typography, Tabs, Tab, Grid, Paper, Button } from "@mui/material";
import useAxiosPrivate from "./../../../hooks/useAxiosPrivate";
import {
  fetchUserStats,
  fetchAppointmentStats,
  fetchFeedbackStats,
} from "./data/statData";
import { useNavigate } from "react-router-dom";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import paths from "../../../routes/paths";
import Revenue from "./components/Revenue";
import AppointmentsOverCarBrands from "./components/AppointmentsOverCarBrands";
import AppointmentsByStatus from "./components/AppointmentsByStatus";
import RevenueByCategories from "./components/RevenueByCategories";

const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
};

const OtherCharts = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [userStat, setUserStat] = useState(null);
  const [appointmentStat, setAppointmentStat] = useState(null);
  const [feedbackStat, setFeedbackStat] = useState(null);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await fetchUserStats(axiosPrivate);
        const conversions = await fetchAppointmentStats(axiosPrivate);
        const feedback = await fetchFeedbackStats(axiosPrivate);

        setUserStat(user);
        setAppointmentStat(conversions);
        setFeedbackStat(feedback);
      } catch (err) {
        console.error("Error loading stats:", err);
      }
    };

    loadData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography component="h2" variant="h6">
          Other Charts
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate(paths.dashboard)}
          startIcon={<ChevronLeftRoundedIcon />}
        >
          Back to Dashboard
        </Button>
      </Box>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="fullWidth"
          centered
        >
          <Tab
            label="Appointments Over Car Brand"
            sx={{ textAlign: "center" }}
          />
          <Tab label="Appointments Over Time" sx={{ textAlign: "center" }} />
          <Tab label="Revenue" sx={{ textAlign: "center" }} />
          <Tab
            label="Revenue By Service Category"
            sx={{ textAlign: "center" }}
          />
        </Tabs>

        <TabPanel value={tab} index={0}>
          <AppointmentsOverCarBrands />
        </TabPanel>

        <TabPanel value={tab} index={1}>
          <AppointmentsByStatus />
        </TabPanel>

        <TabPanel value={tab} index={2}>
          <Revenue />
        </TabPanel>

        <TabPanel value={tab} index={3}>
          <RevenueByCategories />
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default OtherCharts;
