import React, { useEffect, useState } from "react";
import { Grid, Box, Typography } from "@mui/material";
import StatCard from "./components/StatCard";
import HighlightedCard from "./components/HighlightedCard";
import PageViewsBarChart from "./components/PageViewsBarChart";
import SessionsChart from "./components/SessionsChart";
import CustomizedDataGrid from "./components/CustomizedDataGrid";
import TopCustomersTable from "./components/TopCustomersTable";
import useAxiosPrivate from "./../../../hooks/useAxiosPrivate";
import {
  fetchUserStats,
  fetchConversions,
  fetchEventCounts,
} from "./data/statData";

const Dashboard = () => {
  const axiosPrivate = useAxiosPrivate();
  const [userStat, setUserStat] = useState(null);
  const [conversionStat, setConversionStat] = useState(null);
  const [eventStat, setEventStat] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await fetchUserStats(axiosPrivate);
        const conversions = await fetchConversions(axiosPrivate);
        const events = await fetchEventCounts(axiosPrivate);

        setUserStat(user);
        setConversionStat(conversions);
        setEventStat(events);
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
        {userStat && (
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard {...userStat} />
          </Grid>
        )}
        {conversionStat && (
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard {...conversionStat} />
          </Grid>
        )}
        {eventStat && (
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard {...eventStat} />
          </Grid>
        )}

        <Grid item xs={12} sm={6} lg={3}>
          <HighlightedCard />
        </Grid>
        <Grid item xs={12} md={6}>
          <SessionsChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <PageViewsBarChart />
        </Grid>
        <Grid item xs={12}>
          <TopCustomersTable />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
