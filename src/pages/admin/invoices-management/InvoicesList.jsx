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
import InvoiceFilter from "./InvoiceFilter";
import Invoice from "../appointments-management/Invoice";
import VisibilityIcon from "@mui/icons-material/Visibility";

dayjs.extend(utc);
dayjs.extend(timezone);

const InvoicesList = () => {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const [nextPage, setNextPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [prevPage, setPrevPage] = useState(null);
  const pageSize = 3;
  const [count, setCount] = useState(0);
  const [filters, setFilters] = useState({});
  const { socket } = useSocket();

  const fetchInvoices = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get("/api/v1/payments/all/", {
        params: {
          page,
          page_size: pageSize,
        },
      });

      setInvoices(response.data.results.data);
      setNextPage(response.data.next);
      setPrevPage(response.data.previous);
      setCount(response.data.count);
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(count / pageSize);

  useEffect(() => {
    fetchInvoices(1);
  }, []);

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

  const fetchInvoicesWithFilter = async (filters = {}, page = 1) => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (filters.searchTerm) params.append("search", filters.searchTerm);
      if (filters.status) params.append("status", filters.status);
      if (filters.paymentMethod)
        params.append("payment_method", filters.paymentMethod);
      if (filters.startDate) params.append("start_date", filters.startDate);
      if (filters.endDate) params.append("end_date", filters.endDate);
      params.append("page", page);
      params.append("page_size", pageSize);

      const response = await axiosPrivate.get(
        `/api/v1/payments/all/?${params.toString()}`
      );

      setInvoices(response.data.results.data);
      setNextPage(response.data.next);
      setPrevPage(response.data.previous);
      setCount(response.data.count);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchInvoicesWithFilter(newFilters, 1);
  };

  const handleNextPage = () => {
    if (nextPage) fetchInvoicesWithFilter(filters, currentPage + 1);
  };

  const handlePrevPage = () => {
    if (prevPage) fetchInvoicesWithFilter(filters, currentPage - 1);
  };

  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setInvoiceDialogOpen(true);
    // setLoadingDetails(true);
  };

  const handleCloseInvoiceDialog = () => {
    setInvoiceDialogOpen(false);
    setSelectedInvoice(null);
  };

  return (
    <Box p={3}>
      <InvoiceFilter onFilter={handleFilterChange} filters={filters} />
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
                      sx={{
                        verticalAlign: "middle",
                        width: 100,
                        textAlign: "center",
                      }}
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

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box display="flex" gap={1}>
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
                      </Box>

                      <IconButton
                        onClick={() => {
                          handleViewDetails(item);
                        }}
                        disabled={!nextPage}
                        color="primary"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Box>
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
      <Invoice
        invoiceData={selectedInvoice}
        open={invoiceDialogOpen}
        onClose={handleCloseInvoiceDialog}
        editMode={true}
      />
    </Box>
  );
};

export default InvoicesList;
