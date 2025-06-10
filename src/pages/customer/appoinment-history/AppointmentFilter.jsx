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

const AppointmentFilter = ({ onFilter, filters, vehicles }) => {
  const [status, setStatus] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    if (filters) {
      setStatus(filters.status || "");
      setVehicle(filters.vehicle || "");
      setStartDate(filters.startDate ? dayjs(filters.startDate) : null);
      setEndDate(filters.endDate ? dayjs(filters.endDate) : null);
    }
  }, [filters]);

  const handleFilter = () => {
    onFilter({
      status,
      vehicle,
      startDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : null,
      endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : null,
    });
  };

  const handleReset = () => {
    setStatus("");
    setVehicle("");
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
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Vehicle</InputLabel>
        <Select
          value={vehicle}
          label="Vehicle"
          onChange={(e) => setVehicle(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {vehicles.map((v) => (
            <MenuItem key={v.vin} value={v.vin}>
              {v.name} - {v.license_plate}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 160 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={status}
          label="Status"
          onChange={(e) => setStatus(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="confirmed">Confirmed</MenuItem>
          <MenuItem value="processing">processing</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="canceled">Canceled</MenuItem>
        </Select>
      </FormControl>

      <DatePicker
        label="Appointment From Date"
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

export default AppointmentFilter;
