import React, { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import { useRef } from "react";
import { useRecoilState } from "recoil";
import { servicesAtom } from "../../../atoms/servicesAtom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Paper,
  Avatar,
  Box,
  IconButton,
  Stack,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LoadingOverlay from "../../../components/loading/LoadingOverlay";
import AddServiceDialog from "./AddServiceDialog";

const AppointmentDialog = ({
  open,
  onClose,
  onSave,
  appoinmentData,
  isEditMode = true,
  onAddService,
  onRemoveService,
  loading,
}) => {
  const dialogRef = useRef();
  const theme = useTheme();
  const [formData, setFormData] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [services, setServices] = useRecoilState(servicesAtom);

  const statusOptions = ["PENDING", "CONFIRMED", "DONE", "CANCELED"];
  const [currentStatus, setCurrentStatus] = useState("PENDING");

  const statusColors = {
    PENDING: "warning",
    CONFIRMED: "info",
    DONE: "success",
    CANCELED: "error",
  };
  const handleStatusCycle = () => {
    const currentIndex = statusOptions.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statusOptions.length;
    setCurrentStatus(statusOptions[nextIndex]);
  };

  useEffect(() => {
    if (appoinmentData) {
      setFormData(appoinmentData);
    }
  }, [appoinmentData]);

  const totalPrice = formData?.appointment_services?.reduce(
    (sum, s) => sum + parseFloat(s.price || 0),
    0
  );

  const handleClose = () => {
    setFormData({});
    onClose();
  };

  const estimatedTotalTime = (() => {
    if (!formData?.appointment_services)
      return { hours: 0, minutes: 0, doneTime: null };

    let totalMinutes = 0;
    formData.appointment_services.forEach((s) => {
      const [h, m] = s.service.estimated_duration.split(":").map(Number);
      totalMinutes += h * 60 + m;
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const startTime = formData?.date ? new Date(formData.date) : null;
    const doneTime = startTime
      ? new Date(startTime.getTime() + totalMinutes * 60000)
      : null;

    return { hours, minutes, doneTime };
  })();

  const captureDialog = async () => {
    if (!dialogRef.current) return;
    console.log(theme.palette.mode);
    const canvas = await html2canvas(dialogRef.current, {
      backgroundColor: theme.palette.mode === "dark" ? "#34373D" : "#F5F6FA",
      scale: 2,
      useCORS: true,
    });

    const image = canvas.toDataURL("image/png");

    const fileNameSafe = formData.customer.full_name
      ?.replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_]/g, "")
      .toLowerCase();

    const link = document.createElement("a");
    link.href = image;
    link.download = `appointment_details_for_${fileNameSafe || "unknown"}.png`;
    link.click();

    // Nếu muốn gửi lên server / hoặc đẩy vào API gửi qua Email, Zalo, etc.
    // -> dùng `image` là base64 (data:image/png;base64,...)
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disablePortal
      fullWidth
      maxWidth="md"
    >
      <div ref={dialogRef}>
        <DialogTitle align="center">APPOINTMENT DETAILS</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} alignItems="stretch">
            {/* Customer Info */}
            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Paper variant="outlined" sx={{ p: 2, flexGrow: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Customer Information
                </Typography>
                {loading ? (
                  <Box
                    height={100}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography color="text.secondary" fontStyle="italic">
                      Loading Customer Information...
                    </Typography>
                  </Box>
                ) : (
                  <Box display="flex" gap={2} alignItems={"center"}>
                    <Avatar
                      src={formData.customer?.avatar}
                      alt={formData.customer?.full_name}
                      sx={{ width: 56, height: 56 }}
                    />
                    <Box>
                      <Typography>
                        Full Name: {formData.customer?.full_name || "N/A"}
                      </Typography>
                      <Typography>
                        Phone: {formData.customer?.phone || "N/A"}
                      </Typography>
                      <Typography>
                        Email: {formData.customer?.email || "N/A"}
                      </Typography>
                      <Typography>
                        Appointment Time:{" "}
                        {formData.date
                          ? new Date(formData.date).toLocaleString()
                          : "N/A"}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Vehicle Info */}
            <Grid item xs={12} md={6} sx={{ display: "flex" }}>
              <Paper variant="outlined" sx={{ p: 2, flexGrow: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Vehicle Information
                </Typography>

                {loading ? (
                  <Box
                    height={100}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography color="text.secondary" fontStyle="italic">
                      Loading Vehicle Information...
                    </Typography>
                  </Box>
                ) : formData.vehicle_information &&
                  Object.keys(formData.vehicle_information).length > 0 ? (
                  <Box>
                    {Object.entries(formData.vehicle_information).map(
                      ([key, value]) => (
                        <Typography key={key}>
                          {key
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                          : {value}
                        </Typography>
                      )
                    )}
                  </Box>
                ) : (
                  <Box
                    height={100}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography color="text.secondary" fontStyle="italic">
                      No Vehicle Information
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>

          {/* Services */}
          <Box mt={3}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Services
              </Typography>

              <Box display="flex" flexDirection="column" gap={1} mb={2}>
                {formData.appointment_services?.length > 0 ? (
                  formData.appointment_services.map((s) => (
                    <Paper
                      key={s.id}
                      variant="outlined"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        px: 2,
                        py: 1,
                      }}
                    >
                      {/* Service Name (flex-grow) */}
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography fontWeight="bold">
                          {s.service.name}
                        </Typography>
                      </Box>

                      {/* Price (fixed width) */}
                      <Box sx={{ width: 80, textAlign: "left" }}>
                        <Typography>${s.price}</Typography>
                      </Box>

                      {/* Duration with icon (fixed width) */}
                      <Box
                        sx={{
                          width: 130,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          justifyContent: "flex-start",
                          pl: 2,
                        }}
                      >
                        <AccessTimeIcon fontSize="small" />
                        <Typography>{s.service.estimated_duration}</Typography>
                      </Box>

                      {/* Remove button (fixed width) */}
                      <Box sx={{ width: 40, textAlign: "right" }}>
                        <IconButton
                          color="error"
                          onClick={() => onRemoveService(s.id)}
                          size="small"
                        >
                          <RemoveIcon />
                        </IconButton>
                      </Box>
                    </Paper>
                  ))
                ) : (
                  <Typography color="text.secondary" fontStyle="italic">
                    No services selected
                  </Typography>
                )}
              </Box>

              {/* Summary + Add Service Button */}
              <Box
                mt={2}
                pt={2}
                borderTop="1px solid"
                borderColor="divider"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack spacing={1}>
                  <Typography>
                    Estimated Service Duration:{" "}
                    <Box component="span" fontWeight="bold">
                      {estimatedTotalTime.hours} hours{" "}
                      {estimatedTotalTime.minutes} minutes
                    </Box>
                  </Typography>

                  <Typography>
                    Vehicle Ready Time:{" "}
                    <Box component="span" fontWeight="bold">
                      {estimatedTotalTime.doneTime?.toLocaleString?.() || ""}
                    </Box>
                  </Typography>

                  <Typography>
                    Total:{" "}
                    <Box component="span" fontWeight="bold">
                      ${totalPrice?.toFixed(2)}
                    </Box>
                  </Typography>
                </Stack>

                <Button
                  startIcon={<AddIcon />}
                  onClick={() => setIsDialogOpen(true)}
                >
                  Add Service
                </Button>
              </Box>
            </Paper>
          </Box>

          {/* Summary */}
        </DialogContent>
      </div>
      <DialogActions
        sx={{
          justifyContent: "space-between",
          px: 3,
          py: 2,
        }}
      >
        <Button
          variant="contained"
          color={statusColors[currentStatus]}
          onClick={handleStatusCycle}
          sx={{ width: 150, fontWeight: "bold", color: "white" }}
        >
          {currentStatus}
        </Button>
        <Box>
          <Button onClick={captureDialog} variant="outlined" color="primary">
            Export as Image
          </Button>

          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={onSave} color="primary">
            Save
          </Button>
        </Box>
      </DialogActions>
      <AddServiceDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        services={services}
        onAddServices={(selectedServices) => {
          console.log("Services added:", selectedServices);
        }}
      />
      <LoadingOverlay loading={loading} />
    </Dialog>
  );
};

export default AppointmentDialog;
