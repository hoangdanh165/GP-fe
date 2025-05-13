import React, { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import {
  Box,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Button,
} from "@mui/material";
import PaymentQRCode from "./PaymentQRCode";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useSocket } from "../../../contexts/SocketContext";

dayjs.extend(utc);
dayjs.extend(timezone);

const Invoice = ({ invoiceData, open, onClose }) => {
  const componentRef = useRef();
  const [formData, setFormData] = useState({});

  const axiosPrivate = useAxiosPrivate();
  const { socket } = useSocket();
  const [loadingQrCode, setLoadingQrCode] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    contentRef: componentRef,
    documentTitle: `Invoice_${invoiceData?.invoice_id || "N/A"}`,
    onError: (error) => console.error("Print error:", error),
  });

  useEffect(() => {
    if (invoiceData) {
      setFormData(invoiceData);
    }
  }, [invoiceData]);

  const {
    appointment = {},
    invoice_id = "N/A",
    status = "N/A",
    create_at = null,
  } = formData || {};

  const customer = appointment.customer || {};
  const vehicle = appointment.vehicle_information || {};
  const appointment_services = appointment.appointment_services || [];

  useEffect(() => {
    socket.on("newUpdatesOfPayment", (formData) => {
      if (formData && formData.invoice_id === invoice_id) {
        console.log(formData);
        setFormData((prevData) => ({
          ...prevData,
          status: formData.status || prevData.status,
        }));
      }
    });

    return () => {
      socket.off("newUpdatesOfPayment");
    };
  }, [socket, invoice_id]);

  const formattedDate = create_at
    ? new Date(create_at).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "N/A";

  const [cooldown, setCooldown] = useState(0);
  const COOLDOWN_MINUTES = 15;
  const appointmentId = appointment?.id;
  const QR_LOCAL_KEY = `qrCooldownExpiresAt_${appointmentId}`;
  const QR_URL_KEY = `qrPaymentUrl_${appointmentId}`;

  useEffect(() => {
    if (!appointmentId) return;
    const url = localStorage.getItem(QR_URL_KEY);

    const savedExpire = localStorage.getItem(QR_LOCAL_KEY);
    if (savedExpire) {
      const diff = dayjs(savedExpire).diff(dayjs(), "second");
      if (diff > 0) {
        setCooldown(diff);
        setPaymentUrl(url);
        startCooldownCountdown(diff);
      }
    }
  }, [appointmentId]);

  const startCooldownCountdown = (seconds) => {
    let time = seconds;
    const interval = setInterval(() => {
      time -= 1;
      setCooldown(time);
      if (time <= 0) {
        clearInterval(interval);
        localStorage.removeItem(QR_LOCAL_KEY);
      }
    }, 1000);
  };

  const createPaymentUrl = async () => {
    setLoadingQrCode(true);
    console.log(appointment);
    try {
      const response = await axiosPrivate.post("/api/v1/payments/create-url/", {
        order_type: "billpayment",
        order_id: invoice_id,
        amount: appointment.total_price,
        order_desc: "Thanh toan hoa don",
        bank_code: "",
        language: "vn",
      });

      const url = response.data.payment_url;
      setPaymentUrl(url);

      const expireAt = dayjs().add(COOLDOWN_MINUTES, "minute");

      localStorage.setItem(QR_LOCAL_KEY, expireAt.toISOString());
      localStorage.setItem(QR_URL_KEY, url);

      setCooldown(COOLDOWN_MINUTES * 60);
      startCooldownCountdown(COOLDOWN_MINUTES * 60);
    } catch (error) {
      console.error("Error creating payment URL:", error);
    } finally {
      setLoadingQrCode(false);
    }
  };

  const statusMap = {
    pending: {
      label: "Pending",
      color: "warning",
    },
    paid: {
      label: "Paid",
      color: "success",
    },
    failed: {
      label: "Failed",
      color: "error",
    },
    refunded: {
      label: "Refunded",
      color: "info",
    },
    canceled: {
      label: "Canceled",
      color: "default",
    },
  };

  const normalized = status?.toLowerCase?.();
  const config = statusMap[normalized] || {
    label: status,
    color: "default",
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          padding: "20px",
          fontFamily: "Roboto, sans-serif",
          backgroundColor: "#FFFFFF",
        },
      }}
    >
      <DialogTitle>Appointment Invoice</DialogTitle>
      <DialogContent>
        {/* Garage Information */}
        <style>
          {`
      @media print {
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        @page {
          size: A4;
          margin: 20mm 10mm;
        }

        html, body {
          padding: 5mm !important;
        }
      }
    `}
        </style>
        <div ref={componentRef}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Box sx={{ textAlign: "left" }}>
              <PaymentQRCode paymentUrl={paymentUrl} />
              <Button
                variant="outlined"
                color="secondary"
                onClick={createPaymentUrl}
                disabled={loadingQrCode || cooldown > 0}
              >
                {cooldown > 0
                  ? `Wait ${Math.floor(cooldown / 60)}:${(cooldown % 60)
                      .toString()
                      .padStart(2, "0")} to re-generate`
                  : "Generate Payment QR Code"}
              </Button>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Prestige Auto Garage
              </Typography>
              <Typography variant="body2">
                165 Nguyen Luong Bang, Da Nang
              </Typography>
              <Typography variant="body2">
                Co. Reg. No.: 50163020 | VAT No.: GB10223451123
              </Typography>
              <Typography variant="body2">
                Email: contact@prestigeauto.com.vn | Phone: 0123868686
              </Typography>
              <Typography variant="body2">Website: prestigeauto.com</Typography>
            </Box>
          </Box>

          {/* Divider */}
          <Divider sx={{ my: 2 }} />

          {/* Billing and Invoice Info */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            {/* Bill To */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Bill to:
              </Typography>
              <Typography variant="body1">
                {customer?.full_name || "N/A"} - {customer.phone || "N/A"}
              </Typography>
              <Typography variant="body2">
                {customer?.address ? `${customer.address}` : "N/A"}
              </Typography>
            </Box>

            {/* Invoice Details */}
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="body1">
                <strong>Invoice:</strong> {invoice_id || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>Invoice Date:</strong> {formattedDate}
              </Typography>
            </Box>
          </Box>

          {/* Divider */}
          <Divider sx={{ my: 2 }} />

          {/* Services Table */}
          <TableContainer
            component={Paper}
            sx={{
              backgroundColor: "#FFFFFF !important",
            }}
          >
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    borderBottom: "2px solid #E9EBF4",
                    backgroundColor: "#FFFFFF !important",
                  }}
                >
                  <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="right">
                    Quantity
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="right">
                    Unit
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="right">
                    Price
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="right">
                    VAT
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="right">
                    Amount
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {appointment_services.length > 0 ? (
                  appointment_services.map((serviceItem) => {
                    const { service, price } = serviceItem;
                    return (
                      <TableRow
                        key={service?.id || Math.random()}
                        sx={{
                          backgroundColor: "#FFFFFF !important",
                        }}
                      >
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold" }}
                          >
                            {service?.name || "N/A"}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {service?.category?.name || "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">1</TableCell>
                        <TableCell align="right">Service</TableCell>
                        <TableCell align="right">
                          ${parseFloat(price || 0).toFixed(2)}
                        </TableCell>
                        <TableCell align="right">0%</TableCell>
                        <TableCell align="right">
                          ${parseFloat(price || 0).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow
                    sx={{
                      backgroundColor: "#FFFFFF !important",
                    }}
                  >
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2">
                        No services available
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {/* Total Row */}
                <TableRow
                  sx={{
                    backgroundColor: "#FFFFFF !important",
                  }}
                >
                  <TableCell colSpan={6} sx={{ padding: 0 }}>
                    <Divider sx={{ my: 2 }} />
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{
                    backgroundColor: "#FFFFFF !important",
                  }}
                >
                  <TableCell colSpan={5} align="right">
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      Total:
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      $
                      {appointment_services
                        .reduce(
                          (total, item) => total + parseFloat(item.price || 0),
                          0
                        )
                        .toFixed(2)}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
              mt: 5,
            }}
          >
            {/* Bill To */}
            <Box>
              <Typography variant="h7" sx={{ fontWeight: "bold" }}>
                Terms & Conditions
              </Typography>

              <Typography variant="body1">
                Vehicle: {vehicle.name} -{" "}
                {vehicle.license_plate || vehicle.license_plate_number}
              </Typography>
              <Typography variant="body2">
                Payment to be made within 14 days via the QR code above.
              </Typography>
            </Box>
          </Box>
        </div>
      </DialogContent>
      <DialogActions>
        <Chip
          label={config.label}
          color={config.color}
          variant="outlined"
          size="medium"
          sx={{
            fontSize: "10rem",
            padding: "0.1rem 0.5rem",
            height: "40px",
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        />
        <Button onClick={handlePrint} color="primary" variant="contained">
          Print Invoice
        </Button>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Invoice;
