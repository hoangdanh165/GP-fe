import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { BarChart } from "@mui/x-charts/BarChart";
import useAxiosPrivate from "./../../../../hooks/useAxiosPrivate";
import { fetchCategoryCount } from "../data/statData";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";

export default function CategoriesBarChart() {
  const theme = useTheme();
  const axios = useAxiosPrivate();
  const [categories, setCategories] = React.useState<string[]>([]);
  const [values, setValues] = React.useState<number[]>([]);
  const [tooltips, setTooltips] = React.useState<Record<string, string>>({});
  const [tooltipData, setTooltipData] = React.useState<{
    open: boolean;
    x: number;
    y: number;
    content: string;
  }>({
    open: false,
    x: 0,
    y: 0,
    content: "",
  });

  const chartRef = React.useRef<HTMLDivElement>(null);

  const color = theme.palette.primary.main;

  React.useEffect(() => {
    const load = async () => {
      const res = await fetchCategoryCount(axios);
      if (res?.data) {
        const labels = res.data.map((item: any) => item.label);
        const totals = res.data.map((item: any) => item.total);

        const tooltipMap: Record<string, string> = {};
        res.data.forEach((cat: any) => {
          const details = cat.services
            .map((svc: any) => `• ${svc.name}: ${svc.count}`)
            .join("\n");
          tooltipMap[cat.label] = details;
        });

        setCategories(labels);
        setValues(totals);
        setTooltips(tooltipMap);
      }
    };

    load();
  }, [axios]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const bars = chartRef.current?.querySelectorAll("rect");
    if (!bars) return;

    const { clientX, clientY } = event;

    bars.forEach((bar, index) => {
      const rect = bar.getBoundingClientRect();
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        const label = categories[index];
        setTooltipData({
          open: true,
          x: event.clientX,
          y: event.clientY - 20,
          content: `${label}\n${tooltips[label]}`,
        });
      }
    });
  };

  const handleMouseLeave = () => {
    setTooltipData({ ...tooltipData, open: false });
  };

  return (
    <Card variant="outlined" sx={{ width: "100%", position: "relative" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Popular category
        </Typography>
        <Stack sx={{ justifyContent: "space-between" }}>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Total service booked by category (last 30 days)
          </Typography>
        </Stack>

        <Box
          ref={chartRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <BarChart
            xAxis={[{ scaleType: "band", data: categories }]}
            series={[{ data: values, color }]}
            height={300}
            margin={{ left: 40, right: 20, top: 30, bottom: 40 }}
            sx={{
              ".MuiChartsTooltip-root": { display: "none" },
            }}
            slotProps={{ tooltip: { trigger: "none" } }}
          />
        </Box>

        {tooltipData.open && (
          <Box
            sx={{
              position: "fixed",
              top: tooltipData.y,
              left: tooltipData.x,
              backgroundColor: "rgba(0,0,0,0.8)",
              color: "#fff",
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: 12,
              whiteSpace: "pre-line",
              zIndex: 9999,
              pointerEvents: "none",
            }}
          >
            {tooltipData.content}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
