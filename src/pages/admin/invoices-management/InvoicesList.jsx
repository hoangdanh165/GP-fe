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
  Stack,
} from "@mui/material";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useSocket } from "../../../contexts/SocketContext";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import UpdateIcon from "@mui/icons-material/Update";

dayjs.extend(utc);
dayjs.extend(timezone);

const InvoicesList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const [nextPage, setNextPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [prevPage, setPrevPage] = useState(null);
  const pageSize = 10;
  const [count, setCount] = useState(0);
  const { socket } = useSocket();

  const fetchInvoices = async (url = "/api/v1/payments/all/") => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get(url);

      const urlParams = new URLSearchParams(new URL(url).search);
      const page = parseInt(urlParams.get("page")) || 1;
      setCurrentPage(page);

      setInvoices(response.data.results.data);
      setNextPage(response.data.next);
      setPrevPage(response.data.previous);
      setCount(response.data.count);
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(count / pageSize);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleNextPage = () => {
    if (nextPage) {
      fetchInvoices(nextPage);
    }
  };

  const handlePrevPage = () => {
    if (prevPage) {
      fetchInvoices(prevPage);
    }
  };

  const calculateProgress = (services) => {
    const total = services.length;
    const completed = services.filter((s) => s.completed).length;
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (invoices.length === 0) {
    return (
      <Typography variant="h6" align="center" mt={4}>
        No invoices found.
      </Typography>
    );
  }

  const statusColors = {
    PENDING: "warning",
    REFUNDED: "info",
    CANCELED: "error",
    PAID: "success",
    FAILED: "error",
  };

  return (
    <Box p={3}>
      <List>
        {invoices.map((item) => (
          <Paper key={item.id} elevation={3} sx={{ mb: 2, p: 2 }}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold !important" }}
                      >
                        #{item.invoice_id} - {item.method.toUpperCase()}
                        {dayjs()
                          .tz("Asia/Ho_Chi_Minh")
                          .diff(
                            dayjs(item.create_at).tz("Asia/Ho_Chi_Minh"),
                            "minute"
                          ) < 5 && (
                          <Chip
                            label="Recently added"
                            color="success"
                            size="small"
                            variant="outlined"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Typography>
                    </Box>
                    <Chip
                      label={item.status.toUpperCase()}
                      color={
                        statusColors[item.status.toUpperCase()] || "default"
                      }
                      size="medium"
                      variant="filled"
                      sx={{ verticalAlign: "middle" }}
                    />
                  </Box>
                }
                secondary={
                  <Box mt={1}>
                    <Typography variant="body2" gutterBottom>
                      Amount:{" "}
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{ fontWeight: "bold !important" }}
                      >
                        {parseFloat(item.amount).toLocaleString("vi-VN")} VND
                      </Typography>
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Transaction ID:{" "}
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{ fontWeight: "bold !important" }}
                      >
                        {item.transaction_id || "N/A"}
                      </Typography>
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Paid At:{" "}
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{ fontWeight: "bold !important" }}
                      >
                        {item.paid_at
                          ? new Date(item.paid_at).toLocaleString("vi-VN", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })
                          : "N/A"}
                      </Typography>
                    </Typography>

                    <Stack direction="row" spacing={1} mt={1}>
                      <Chip
                        label={`${new Date(
                          item.create_at
                        ).toLocaleTimeString()}`}
                        color="info"
                        size="small"
                        icon={<AccessTimeIcon />}
                        variant="outlined"
                      />
                      <Chip
                        label={`${new Date(
                          item.update_at
                        ).toLocaleTimeString()}`}
                        color="warning"
                        size="small"
                        icon={<UpdateIcon />}
                        variant="outlined"
                      />
                    </Stack>
                  </Box>
                }
              />
            </ListItem>
          </Paper>
        ))}
      </List>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={3}
      >
        <Button
          variant="contained"
          onClick={handlePrevPage}
          disabled={!prevPage}
        >
          Previous
        </Button>
        <Typography variant="body1">
          Page {currentPage} of {totalPages}
        </Typography>
        <Button
          variant="contained"
          onClick={handleNextPage}
          disabled={!nextPage}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default InvoicesList;
