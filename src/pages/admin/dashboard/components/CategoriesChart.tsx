import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { LineChart } from "@mui/x-charts/LineChart";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import useAxiosPrivate from "./../../../../hooks/useAxiosPrivate";
import { fetchCategoryCount } from "../data/statData";
dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONE = "Asia/Ho_Chi_Minh";

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

function getLast30Days() {
  const days: string[] = [];

  for (let i = 29; i >= 0; i--) {
    const date = dayjs().tz(TIMEZONE).subtract(i, "day");
    const label = date.format("MMM D");
    days.push(label);
  }

  return days;
}

export default function CategoriesChart() {
  const theme = useTheme();
  const axios = useAxiosPrivate();
  const data = getLast30Days();

  const [series, setSeries] = React.useState<any[]>([]);
  const [total, setTotal] = React.useState(0);

  const colorPalette = [
    theme.palette.primary.light,
    theme.palette.primary.main,
    theme.palette.primary.dark,
    theme.palette.success.main,
    theme.palette.secondary.main,
  ];

  React.useEffect(() => {
    const load = async () => {
      const res = await fetchCategoryCount(axios);
      if (res?.data) {
        const result: any[] = res.data.map((item, index) => ({
          ...item,
          color: colorPalette[index % colorPalette.length],
          showMark: false,
          curve: "linear",
          area: true,
          stack: "total",
          stackOrder: "ascending",
        }));
        const totalCount = res.data.reduce(
          (acc, item) => acc + item.data.reduce((s, v) => s + v, 0),
          0
        );
        setSeries(result);
        setTotal(totalCount);
      }
    };
    load();
  }, [axios]);

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Popular category
        </Typography>
        <Stack sx={{ justifyContent: "space-between" }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: "center", sm: "flex-start" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              {total.toLocaleString()}
            </Typography>
          </Stack>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Total service usages by category (last 30 days)
          </Typography>
        </Stack>
        <LineChart
          colors={colorPalette}
          xAxis={[
            {
              scaleType: "point",
              data,
              tickInterval: (index, i) => (i + 1) % 5 === 0,
            },
          ]}
          series={series}
          height={250}
          margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          sx={{
            "& .MuiAreaElement-series-organic": {
              fill: "url('#organic')",
            },
          }}
          slotProps={{
            legend: {
              hidden: false,
            },
          }}
        >
          {series.map((item) => (
            <AreaGradient key={item.id} color={item.color} id={item.id} />
          ))}
        </LineChart>
      </CardContent>
    </Card>
  );
}
