import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import { areaElementClasses } from "@mui/x-charts/LineChart";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import CircularProgress from "@mui/material/CircularProgress";

dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONE = "Asia/Ho_Chi_Minh";

export type StatCardProps = {
  title?: string;
  value?: string;
  interval?: string;
  trend?: "up" | "down" | "neutral";
  data?: number[];
  loading?: boolean;
};

function getLast30Days() {
  const days: string[] = [];

  for (let i = 29; i >= 0; i--) {
    const date = dayjs().tz(TIMEZONE).subtract(i, "day");
    const label = date.format("MMM D");
    days.push(label);
  }

  return days;
}

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.3} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

export default function StatCard({
  title = "",
  value = "",
  interval = "",
  trend = "neutral",
  data = [],
  loading = false,
}: StatCardProps) {
  const theme = useTheme();
  const daysInWeek = getLast30Days();

  const trendColors = {
    up:
      theme.palette.mode === "light"
        ? theme.palette.success.main
        : theme.palette.success.dark,
    down:
      theme.palette.mode === "light"
        ? theme.palette.error.main
        : theme.palette.error.dark,
    neutral:
      theme.palette.mode === "light"
        ? theme.palette.grey[400]
        : theme.palette.grey[700],
  };

  const labelColors = {
    up: "success" as const,
    down: "error" as const,
    neutral: "default" as const,
  };

  const color = labelColors[trend];
  const chartColor = trendColors[trend];
  const trendValues = { up: "+25%", down: "-25%", neutral: "+5%" };

  if (loading) {
    return (
      <Card
        variant="outlined"
        sx={{
          height: "100%",
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={28} sx={{ mb: 1 }} />
          <Typography variant="body2">Loading chart data...</Typography>
        </Box>
      </Card>
    );
  }

  return (
    <Card variant="outlined" sx={{ height: "100%", flexGrow: 1 }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          {title}
        </Typography>
        <Stack
          direction="column"
          sx={{ justifyContent: "space-between", flexGrow: "1", gap: 1 }}
        >
          <Stack sx={{ justifyContent: "space-between" }}>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <Typography variant="h4" component="p">
                {value}
              </Typography>
              {/* <Chip size="small" color={color} label={trendValues[trend]} /> */}
            </Stack>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {interval}
            </Typography>
          </Stack>
          <Box sx={{ width: "100%", height: 50 }}>
            <SparkLineChart
              colors={[chartColor]}
              data={data}
              area
              showHighlight
              showTooltip
              xAxis={{
                scaleType: "band",
                data: daysInWeek, // Use the correct property 'data' for xAxis
              }}
              sx={{
                [`& .${areaElementClasses.root}`]: {
                  fill: `url(#area-gradient-${value})`,
                },
              }}
            >
              <AreaGradient color={chartColor} id={`area-gradient-${value}`} />
            </SparkLineChart>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
