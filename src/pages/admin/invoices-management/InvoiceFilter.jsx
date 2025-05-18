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

const InvoiceFilter = ({ onFilter, filters }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    if (filters) {
      setSearchTerm(filters.searchTerm || "");
      setStatus(filters.status || "");
      setPaymentMethod(filters.paymentMethod || "");
      setStartDate(filters.startDate ? dayjs(filters.startDate) : null);
      setEndDate(filters.endDate ? dayjs(filters.endDate) : null);
    }
  }, [filters]);

  const handleFilter = () => {
    onFilter({
      searchTerm,
      status,
      paymentMethod,
      startDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : null,
      endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : null,
    });
  };

  const handleReset = () => {
    setSearchTerm("");
    setStatus("");
    setPaymentMethod("");
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
        label="Search"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ flex: 1, minWidth: 200 }}
      />

      <FormControl sx={{ minWidth: 160 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={status}
          label="Status"
          onChange={(e) => setStatus(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="paid">Paid</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="failed">Failed</MenuItem>
          <MenuItem value="refunded">Refunded</MenuItem>
          <MenuItem value="canceled">Canceled</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 160 }}>
        <InputLabel>Payment Method</InputLabel>
        <Select
          value={paymentMethod}
          label="Payment Method"
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="cash">Cash</MenuItem>
          <MenuItem value="VNPAY">VNPay</MenuItem>
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

export default InvoiceFilter;
