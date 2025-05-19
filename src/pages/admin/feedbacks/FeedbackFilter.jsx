import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
  Select,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const FeedbackFilter = ({ onFilter, filters }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [rating, setRating] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    if (filters) {
      setSearchTerm(filters.searchTerm || "");
      setRating(filters.rating || "");
      setStartDate(filters.startDate ? dayjs(filters.startDate) : null);
      setEndDate(filters.endDate ? dayjs(filters.endDate) : null);
    }
  }, [filters]);

  const handleFilter = () => {
    onFilter({
      searchTerm,
      rating,
      startDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : null,
      endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : null,
    });
  };

  const handleReset = () => {
    setSearchTerm("");
    setRating("");
    setStartDate(null);
    setEndDate(null);
    onFilter({});
  };

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      gap={2}
      mb={3}
      alignItems="center"
      justifyContent="space-between"
    >
      <TextField
        label="Search by Customer Name"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ flex: 1, minWidth: 200 }}
      />

      <FormControl sx={{ minWidth: 160 }}>
        <InputLabel>Rating</InputLabel>
        <Select
          value={rating}
          label="Rating"
          onChange={(e) => setRating(e.target.value)}
        >
          <MenuItem value="1">1 Star</MenuItem>
          <MenuItem value="2">2 Stars</MenuItem>
          <MenuItem value="3">3 Stars</MenuItem>
          <MenuItem value="4">4 Stars</MenuItem>
          <MenuItem value="5">5 Stars</MenuItem>
        </Select>
      </FormControl>

      <DatePicker
        label="Create From Date"
        value={startDate}
        onChange={(newValue) => setStartDate(newValue)}
      />
      <DatePicker
        label="To Date"
        value={endDate}
        onChange={(newValue) => setEndDate(newValue)}
      />

      <Button variant="outlined" onClick={handleReset}>
        Reset
      </Button>
      <Button variant="contained" onClick={handleFilter}>
        Apply
      </Button>
    </Box>
  );
};

export default FeedbackFilter;
