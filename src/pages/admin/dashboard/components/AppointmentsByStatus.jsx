import * as React from "react";
import { useTheme } from "@mui/material/styles";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  CircularProgress,
  Box,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LineChart } from "@mui/x-charts/LineChart";
import dayjs from "dayjs";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { fetchAppointmentByStatusStats } from "../data/statData";

export default function AppointmentStats() {
  const theme = useTheme();
  const axios = useAxiosPrivate();

  const defaultTo = dayjs().startOf("month");
  const defaultFrom = defaultTo.subtract(1, "month");

  const [from, setFrom] = React.useState(defaultFrom);
  const [to, setTo] = React.useState(defaultTo);
  const [loading, setLoading] = React.useState(true);
  const [chartData, setChartData] = React.useState([]);
  const [statusLabels, setStatusLabels] = React.useState([]);
  const [totalPerStatus, setTotalPerStatus] = React.useState({});

  const colorPalette = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.secondary.main,
    theme.palette.info.main,
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchAppointmentByStatusStats(
        axios,
        from.format("YYYY-MM-DD"),
        to.format("YYYY-MM-DD")
      );
      if (res?.daily_counts) {
        setChartData(res.daily_counts || []);
        setTotalPerStatus(res.total_by_status || {});
        setStatusLabels(Object.keys(res.total_by_status || {}).sort());
      }
    } catch (err) {
      console.error("Failed to fetch appointment stats", err);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    loadData();
  }, [from, to]);

  const xData = chartData.map((item) => item.date);

  const statusSeries = statusLabels.map((status, i) => ({
    label: status,
    data: chartData.map((d) => d.by_status?.[status] || 0),
    color: colorPalette[i % colorPalette.length],
    showMark: true,
  }));

  const totalSeries = {
    label: "Total",
    data: chartData.map((d) => d.total || 0),
    color: theme.palette.grey[700],
    showMark: true,
    strokeWidth: 2,
    curve: "monotone",
  };

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Appointment Statistics by Status
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          sx={{ my: 2 }}
        >
          <Stack direction="row" spacing={2}>
            <DatePicker
              label="From"
              value={from}
              onChange={(newValue) => setFrom(newValue)}
              format="YYYY-MM-DD"
              slotProps={{ textField: { size: "small" } }}
            />
            <DatePicker
              label="To"
              value={to}
              onChange={(newValue) => setTo(newValue)}
              format="YYYY-MM-DD"
              slotProps={{ textField: { size: "small" } }}
            />
          </Stack>

          <Typography variant="body2" fontWeight="bold">
            Total: {Object.values(totalPerStatus).reduce((a, b) => a + b, 0)}{" "}
            appointments
          </Typography>
          <Stack direction="column" spacing={0.5} alignItems="flex-end">
            {statusLabels.map((status) => (
              <Typography
                key={status}
                variant="caption"
                sx={{ color: theme.palette.text.secondary }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}:{" "}
                {totalPerStatus?.[status] || 0}
              </Typography>
            ))}
          </Stack>
        </Stack>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : chartData.length === 0 ? (
          <Box sx={{ textAlign: "center", p: 3 }}>
            <Typography variant="body2" color="text.secondary">
              No appointment data available
            </Typography>
          </Box>
        ) : (
          <LineChart
            xAxis={[
              {
                scaleType: "point",
                data: xData,
                tickInterval: (val, i) => (i + 1) % 3 === 0,
              },
            ]}
            series={[...statusSeries, totalSeries]}
            height={300}
            margin={{ top: 30, bottom: 40, left: 60, right: 20 }}
            grid={{ horizontal: true }}
            slotProps={{
              legend: {
                direction: "row",
                position: { vertical: "left", horizontal: "middle" },
                padding: 10,
                itemMarkWidth: 20,
                itemMarkHeight: 20,
                markGap: 6,
                itemGap: 10,
              },
            }}
            tooltip={{
              trigger: "axis",
              formatter: (context) => {
                const index = context[0].dataIndex;
                const dayData = chartData[index];
                const lines = statusLabels
                  .map((s) => `${s}: ${dayData.by_status?.[s] || 0}`)
                  .join("<br/>");
                return `<strong>${dayData.date}</strong><br/>
                        ${lines}<br/>
                        <strong>Total:</strong> ${dayData.total}`;
              },
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}
