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
import { fetchPopularCarBrandsStats } from "../data/statData";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";

export default function AppointmentsOverCarBrands() {
  const theme = useTheme();
  const [loading, setLoading] = React.useState(true);
  const [brands, setBrands] = React.useState([]);
  const [series, setSeries] = React.useState([]);
  const axios = useAxiosPrivate();

  const colorPalette = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.info.main,
  ];

  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetchPopularCarBrandsStats(axios);
        if (res) {
          const brandLabels = res.map((item) => item.brand);
          const typeSet = new Set();

          // collect all types across all brands
          res.forEach((brand) => {
            brand.types.forEach((t) => typeSet.add(t.name));
          });

          const typeArray = Array.from(typeSet);
          const typeColorMap = typeArray.reduce((acc, type, i) => {
            acc[type] = colorPalette[i % colorPalette.length];
            return acc;
          }, {});

          const seriesData = typeArray.map((type) => ({
            label: type,
            data: res.map((brand) => {
              const found = brand.types.find((t) => t.name === type);
              return found ? found.count : 0;
            }),
            color: typeColorMap[type],
            stack: "total",
          }));
          console.log("brands", brandLabels);
          console.log("series", seriesData);
          setBrands(brandLabels);
          setSeries(seriesData);
        }
      } catch (err) {
        console.error("Failed to fetch car brand stats", err);
      }
      setLoading(false);
    };

    loadData();
  }, [axios]);

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Vehicle Brands Overview
        </Typography>
        <Stack sx={{ justifyContent: "space-between" }}>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Appointments grouped by brand and vehicle type (all time)
          </Typography>
        </Stack>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <BarChart
            xAxis={[{ scaleType: "band", data: brands }]}
            series={series}
            height={300}
            margin={{ top: 30, bottom: 40, left: 50, right: 20 }}
            grid={{ horizontal: true }}
            slotProps={{
              legend: { hidden: false },
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}
