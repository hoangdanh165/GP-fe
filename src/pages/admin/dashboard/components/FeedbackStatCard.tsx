import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";

import {
  Card,
  CardContent,
  Stack,
  Box,
  Typography,
  TextField,
  Rating,
} from "@mui/material";
export type StatCardProps = {
  title: string;
  value: string; // Số sao trung bình
  total: number; // Tổng số đánh giá
};

export default function FeedbackStatCard({
  title,
  value,
  total,
}: StatCardProps) {
  const theme = useTheme();

  return (
    <Card variant="outlined" sx={{ height: "100%", flexGrow: 1 }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          {title}
        </Typography>
        <Box display="flex" alignItems="center" mt={1}>
          <Typography variant="h4" component="p">
            {total}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ ml: 1, color: "text.secondary" }}
          >
            feedbacks
          </Typography>
        </Box>

        <Typography
          variant="caption"
          sx={{ color: "text.secondary", mt: 1, display: "block" }}
        >
          All time
        </Typography>
        <Tooltip
          title={`${parseFloat(value)} star${
            parseFloat(value) === 1 ? "" : "s"
          }`}
        >
          <span>
            <Rating
              value={parseFloat(value)}
              precision={0.1}
              readOnly
              size="large"
              sx={{ mt: 1 }}
            />
          </span>
        </Tooltip>
      </CardContent>
    </Card>
  );
}
