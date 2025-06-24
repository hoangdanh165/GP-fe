import React, { useEffect, useState } from "react";
import { Grid, Box, Typography } from "@mui/material";
import StatCard from "./components/StatCard";
import HighlightedCard from "./components/HighlightedCard";
import PopularTimeSlotsChart from "./components/PopularTimeSlotsChart";
import CategoriesChart from "./components/CategoriesChart";
import CustomizedDataGrid from "./components/CustomizedDataGrid";
import FeedbackStatCard from "./components/FeedbackStatCard";
import TopCustomersTable from "./components/TopCustomersTable";
import useAxiosPrivate from "./../../../hooks/useAxiosPrivate";
import {
  fetchUserStats,
  fetchAppointmentStats,
  fetchFeedbackStats,
} from "./data/statData";

const Dashboard = () => {
  const axiosPrivate = useAxiosPrivate();
  const [userStat, setUserStat] = useState(null);
  const [appointmentStat, setAppointmentStat] = useState(null);
  const [feedbackStat, setFeedbackStat] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await fetchUserStats(axiosPrivate);
        const conversions = await fetchAppointmentStats(axiosPrivate);
        const feedbackStat = await fetchFeedbackStats(axiosPrivate);

        setUserStat(user);
        setAppointmentStat(conversions);
        setFeedbackStat(feedbackStat);
      } catch (err) {
        console.error("Error loading stats:", err);
      }
    };

    loadData();
  }, []);

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Statistic
      </Typography>

      <Grid container spacing={2} columns={12} sx={{ mb: 2 }}>
        {userStat ? (
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard {...userStat} loading={userStat === null} />
          </Grid>
        ) : (
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard loading={true} />
          </Grid>
        )}
        {appointmentStat ? (
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard {...appointmentStat} loading={appointmentStat === null} />
          </Grid>
        ) : (
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard loading={true} />
          </Grid>
        )}
        {feedbackStat ? (
          <Grid item xs={12} sm={6} lg={3}>
            <FeedbackStatCard
              {...feedbackStat}
              loading={feedbackStat === null}
            />
          </Grid>
        ) : (
          <Grid item xs={12} sm={6} lg={3}>
            <FeedbackStatCard loading={true} />
          </Grid>
        )}

        <Grid item xs={12} sm={6} lg={3}>
          <HighlightedCard />
        </Grid>
        <Grid item xs={12} md={6}>
          <CategoriesChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <PopularTimeSlotsChart />
        </Grid>
        <Grid item xs={12}>
          <TopCustomersTable />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
