import React, { useEffect, useState } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Paper,
  Box,
  Chip,
  LinearProgress,
  Divider,
  Button,
  Rating,
  Stack,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useSocket } from "../../../contexts/SocketContext";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import UpdateIcon from "@mui/icons-material/Update";
import FeedbackFilter from "./FeedbackFilter";
import Invoice from "../appointments-management/Invoice";
import VisibilityIcon from "@mui/icons-material/Visibility";

dayjs.extend(utc);
dayjs.extend(timezone);

const FeedbacksList = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const [nextPage, setNextPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [prevPage, setPrevPage] = useState(null);
  const pageSize = 3;
  const [count, setCount] = useState(0);
  const [filters, setFilters] = useState({});

  const fetchFeedbacks = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get("/api/v1/feedbacks/all/", {
        params: {
          page,
          page_size: pageSize,
        },
      });

      setFeedbacks(response.data.results.data);
      setNextPage(response.data.next);
      setPrevPage(response.data.previous);
      setCount(response.data.count);
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to fetch feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(count / pageSize);

  useEffect(() => {
    fetchFeedbacks(1);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  const statusColors = {
    PENDING: "warning",
    REFUNDED: "info",
    CANCELED: "error",
    PAID: "success",
    FAILED: "error",
  };

  const fetchFeedbacksWithFilter = async (filters = {}, page = 1) => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (filters.searchTerm) params.append("search", filters.searchTerm);
      if (filters.rating) params.append("rating", filters.rating);
      if (filters.startDate) params.append("start_date", filters.startDate);
      if (filters.endDate) params.append("end_date", filters.endDate);
      params.append("page", page);
      params.append("page_size", pageSize);

      const response = await axiosPrivate.get(
        `/api/v1/feedbacks/all/?${params.toString()}`
      );

      setFeedbacks(response.data.results.data);
      setNextPage(response.data.next);
      setPrevPage(response.data.previous);
      setCount(response.data.count);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchFeedbacksWithFilter(newFilters, 1);
  };

  const handleNextPage = () => {
    if (nextPage) fetchFeedbacksWithFilter(filters, currentPage + 1);
  };

  const handlePrevPage = () => {
    if (prevPage) fetchFeedbacksWithFilter(filters, currentPage - 1);
  };

  return (
    <Box p={3}>
      <Box mb={3}>
        <FeedbackFilter onFilter={handleFilterChange} filters={filters} />
      </Box>

      {feedbacks.length === 0 ? (
        <Typography variant="h6" color="text.secondary" align="center" mt={5}>
          No feedbacks found.
        </Typography>
      ) : (
        <List>
          {feedbacks.map((item) => (
            <Paper key={item.id} elevation={3} sx={{ mb: 2, p: 2 }}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {item.user_full_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(item.create_at).toLocaleString("vi-VN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box mt={1}>
                      <Typography variant="body1" gutterBottom>
                        {item.comment}
                      </Typography>

                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2" color="text.secondary">
                          Rating:
                        </Typography>
                        <Rating
                          name="feedback-rating"
                          value={item.rating}
                          readOnly
                          precision={0.5}
                        />
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            </Paper>
          ))}
        </List>
      )}

      {/* Pagination */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={3}
      >
        <Button
          variant="outlined"
          onClick={handlePrevPage}
          disabled={!prevPage}
        >
          Previous
        </Button>
        <Chip
          label={`Page ${currentPage} of ${totalPages}`}
          color="info"
          size="medium"
          variant="outlined"
        />
        <Button
          variant="outlined"
          onClick={handleNextPage}
          disabled={!nextPage}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default FeedbacksList;
