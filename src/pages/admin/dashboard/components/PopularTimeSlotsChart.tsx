import * as React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTheme } from "@mui/material/styles";
import { fetchPopularTimeSlotsStats } from "../data/statData";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function PopularTimeSlotsChart() {
  const theme = useTheme();
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const axios = useAxiosPrivate();

  const colorPalette = [
    theme.palette.primary.dark,
    theme.palette.primary.main,
    theme.palette.primary.light,
  ];

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetchPopularTimeSlotsStats(axios);
        setChartData(res);
      } catch (err) {
        console.error("Failed to fetch time slot stats", err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [axios]);

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Popular time slots
        </Typography>
        <Stack sx={{ justifyContent: "space-between" }}>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Bookings per time slot (all time)
          </Typography>
        </Stack>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 3,
              mb: 3,
            }}
          >
            <CircularProgress size={28} sx={{ mb: 1 }} />
            <Typography variant="body2">Loading chart data...</Typography>
          </Box>
        ) : chartData ? (
          <BarChart
            borderRadius={8}
            colors={colorPalette}
            xAxis={[chartData.xAxis]}
            series={chartData.series}
            height={300}
            margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
            grid={{ horizontal: true }}
            slotProps={{
              legend: {
                hidden: true,
              },
            }}
          />
        ) : (
          <Typography sx={{ mt: 2 }}>No data available</Typography>
        )}
      </CardContent>
    </Card>
  );
}
