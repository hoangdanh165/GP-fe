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
import { BarChart } from "@mui/x-charts/BarChart";
import { fetchRevenueByCategoriesStats } from "../data/statData";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function RevenueByCategories() {
  const theme = useTheme();
  const axios = useAxiosPrivate();

  const [loading, setLoading] = React.useState(true);
  const [totalRevenue, setTotalRevenue] = React.useState(0);
  const [chartData, setChartData] = React.useState([]);
  const defaultTo = dayjs().startOf("month");
  const defaultFrom = defaultTo.subtract(1, "month");

  const [from, setFrom] = React.useState(defaultFrom);
  const [to, setTo] = React.useState(defaultTo);

  const color = theme.palette.primary.main;

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchRevenueByCategoriesStats(
        axios,
        from.format("YYYY-MM-DD"),
        to.format("YYYY-MM-DD")
      );
      if (res?.data) {
        setTotalRevenue(res.total_revenue || 0);
        setChartData(res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch revenue stats", err);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    loadData();
  }, [from, to]);

  const categories = chartData.map((item) => item.category);
  const revenue = chartData.map((item) => item.total);

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Revenue by Service Category
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
              slotProps={{
                textField: { size: "small" },
              }}
            />
            <DatePicker
              label="To"
              value={to}
              onChange={(newValue) => setTo(newValue)}
              format="YYYY-MM-DD"
              slotProps={{
                textField: { size: "small" },
              }}
            />
          </Stack>

          <Typography variant="body2" fontWeight="bold">
            Total: {totalRevenue.toLocaleString("vi-VN")} ₫
          </Typography>
        </Stack>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : chartData.length === 0 ? (
          <Box sx={{ textAlign: "center", p: 3 }}>
            <Typography variant="body2" color="text.secondary">
              No revenue data available
            </Typography>
          </Box>
        ) : (
          <BarChart
            xAxis={[
              {
                scaleType: "band",
                data: categories,
                label: "Category",
              },
            ]}
            series={[
              {
                data: revenue,
                label: "Revenue",
                color: color,
              },
            ]}
            height={300}
            margin={{ top: 30, bottom: 40, left: 60, right: 20 }}
            grid={{ horizontal: true }}
            tooltip={{
              trigger: "item",
              formatter: (value, context) => {
                return `${
                  categories[context.dataIndex]
                }: ${value.toLocaleString("vi-VN")} ₫`;
              },
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}
