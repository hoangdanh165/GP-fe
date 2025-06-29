import React, { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import { useRef } from "react";
import { useRecoilState } from "recoil";
import { servicesAtom } from "../../../atoms/servicesAtom";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
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
  Divider,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LoadingOverlay from "../../../components/loading/LoadingOverlay";
import AddServiceDialog from "./AddServiceDialog";
import useShowSnackbar from "../../../hooks/useShowSnackbar";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { customersAtom } from "../../../atoms/customersAtom";

dayjs.extend(utc);
dayjs.extend(timezone);

const AddAppointmentDialog = ({
  open,
  onClose,
  onSave,
  selectedDate,
  loading,
  initialVehicleInputs = [],
}) => {
  const axiosPrivate = useAxiosPrivate();
  const dialogRef = useRef();
  const theme = useTheme();
  const { showSnackbar, CustomSnackbar } = useShowSnackbar();
  const [formData, setFormData] = useState({
    date: new Date(),
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [services, setServices] = useRecoilState(servicesAtom);
  const [customers, setCustomers] = useRecoilState(customersAtom);
  const [vehicleInputs, setVehicleInputs] = useState(
    initialVehicleInputs.length > 0
      ? initialVehicleInputs
      : [{ key: "", value: "" }]
  );

  const [loadingCustomer, setLoadingCustomer] = useState(false);

  const statusOptions = [
    "PENDING",
    "CONFIRMED",
    // , "COMPLETED", "CANCELED"
  ];
  const [currentStatus, setCurrentStatus] = useState("PENDING");

  const handleCustomerChange = async (event) => {
    setFormData((prev) => ({
      ...prev,
      customer: null,
    }));
    setLoadingCustomer(true);
    const customerId = event.target.value;
    try {
      const response = await axiosPrivate.get(`/api/v1/users/${customerId}`);
      setFormData((prev) => ({
        ...prev,
        customer: response.data,
      }));
    } catch (error) {
      console.error("Error fetching customer details:", error);
    } finally {
      setLoadingCustomer(false);
    }
  };

  const handleVehicleInputChange = (index, field, value) => {
    const newInputs = [...vehicleInputs];
    newInputs[index][field] = value;
    setVehicleInputs(newInputs);

    const newVehicleInfo = newInputs.reduce((acc, input) => {
      if (input.key.trim() !== "") {
        acc[input.key] = input.value;
      }
      return acc;
    }, {});
    setFormData((prev) => ({
      ...prev,
      vehicle_information: newVehicleInfo,
    }));
  };

  const removeVehicleInput = (index) => {
    if (vehicleInputs.length > 1) {
      const newInputs = vehicleInputs.filter((_, i) => i !== index);
      setVehicleInputs(newInputs);

      const newVehicleInfo = newInputs.reduce((acc, input) => {
        if (input.key.trim() !== "") {
          acc[input.key] = input.value;
        }
        return acc;
      }, {});
      setFormData((prev) => ({
        ...prev,
        vehicle_information: newVehicleInfo,
      }));
    }
  };

  const addVehicleInput = () => {
    setVehicleInputs([...vehicleInputs, { key: "", value: "" }]);
  };

  const statusColors = {
    PENDING: "warning",
    CONFIRMED: "info",
    // COMPLETED: "success",
    // CANCELED: "error",
  };

  const handleStatusCycle = () => {
    const currentIndex = statusOptions.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statusOptions.length;
    setCurrentStatus(statusOptions[nextIndex]);
  };

  const handleClose = () => {
    setFormData({
      customer: null,
      vehicle_information: {},
      appointment_services: [],
      date: null,
      create_at: null,
      update_at: null,
    });
    setVehicleInputs([{ key: "", value: "" }]);
    setCurrentStatus("PENDING");
    setIsDialogOpen(false);
    onClose();
  };

  const handleAddService = (selectedServices) => {
    setFormData((prev) => {
      const existingServiceIds = new Set(
        (prev.appointment_services || []).map((s) => s.service.id)
      );

      const duplicatedServices = selectedServices.filter((s) =>
        existingServiceIds.has(s.id)
      );

      const newServices = selectedServices.filter(
        (s) => !existingServiceIds.has(s.id)
      );

      if (duplicatedServices.length > 0) {
        const duplicatedNames = duplicatedServices
          .slice(0, 2)
          .map((s) => s.name);
        const moreCount = duplicatedServices.length - duplicatedNames.length;
        const nameList = duplicatedNames.join(", ");
        const moreText = moreCount > 0 ? ` and ${moreCount} more...` : "";

        showSnackbar(
          `Some of selected services already in the list! (${nameList}${moreText})`,
          "error"
        );
      }

      const mappedServices = newServices.map((s) => ({
        id: s.id,
        service: s,
        price: s.price,
      }));

      return {
        ...prev,
        appointment_services: [
          ...(prev.appointment_services || []),
          ...mappedServices,
        ],
      };
    });

    setIsDialogOpen(false);
  };

  const handleRemoveService = (id) => {
    setFormData((prev) => ({
      ...prev,
      appointment_services: prev.appointment_services.filter(
        (s) => s.id !== id
      ),
    }));
  };

  const formatToVNTime = (date) => {
    return dayjs(date).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm:ssZ");
  };

  const getDiscountedPrice = (service, appointmentDate) => {
    const { price, discount, discount_from, discount_to } = service;

    if (discount && discount_from && discount_to && appointmentDate) {
      const from = new Date(discount_from);
      const to = new Date(discount_to);
      const appointment = new Date(appointmentDate);
      if (appointment >= from && appointment <= to) {
        const originalPrice = parseFloat(price);
        const discountAmount = (originalPrice * parseFloat(discount)) / 100;
        const finalPrice = originalPrice - discountAmount;

        return {
          discounted: true,
          original: originalPrice.toFixed(2),
          final: finalPrice.toFixed(2),
        };
      }
    }

    return {
      discounted: false,
      original: parseFloat(price).toFixed(2),
      final: parseFloat(price).toFixed(2),
    };
  };

  const totalPrice = formData?.appointment_services?.reduce((sum, s) => {
    const { final } = getDiscountedPrice(s.service, formData.date);
    return sum + parseFloat(final);
  }, 0);

  const estimatedTotalTime = (() => {
    if (!formData?.appointment_services)
      return { hours: 0, minutes: 0, doneTime: null };

    let totalMinutes = 0;
    formData.appointment_services.forEach((s) => {
      const [h, m] = s.service.estimated_duration.split(":").map(Number);
      totalMinutes += h * 60 + m;
    });

    const addMinutesRespectingWorkHours = (startDate, minutesToAdd) => {
      const workShifts = [
        { start: "08:00", end: "12:00" },
        { start: "13:30", end: "17:30" },
      ];

      const isWorkingDay = (date) => {
        const day = date.getDay(); // 0 = CN, 6 = Thứ 7
        return day >= 1 && day <= 6; // Thứ 2 (1) -> Thứ 7 (6)
      };

      let current = new Date(startDate);
      let minutesLeft = minutesToAdd;

      while (minutesLeft > 0) {
        if (!isWorkingDay(current)) {
          // Nếu là Chủ Nhật, nhảy sang thứ 2
          current.setDate(current.getDate() + 1);
          current.setHours(8, 0, 0, 0);
          continue;
        }

        const shift = workShifts.find(({ start, end }) => {
          const [sh, sm] = start.split(":").map(Number);
          const [eh, em] = end.split(":").map(Number);

          const shiftStart = new Date(current);
          shiftStart.setHours(sh, sm, 0, 0);

          const shiftEnd = new Date(current);
          shiftEnd.setHours(eh, em, 0, 0);

          return current >= shiftStart && current < shiftEnd;
        });

        if (!shift) {
          // Không nằm trong ca làm việc nào, chuyển sang ca tiếp theo hoặc hôm sau
          const nextShift = workShifts[0];
          const [nh, nm] = nextShift.start.split(":").map(Number);

          // Nếu sau ca chiều, chuyển sang sáng hôm sau
          if (current.getHours() >= 17 || current.getHours() < 8) {
            current.setDate(current.getDate() + 1);
            current.setHours(nh, nm, 0, 0);
          } else {
            // Nếu giữa các ca (ví dụ 12:00 - 13:30), thì set tới ca chiều
            const afternoonShift = workShifts[1];
            const [ah, am] = afternoonShift.start.split(":").map(Number);
            current.setHours(ah, am, 0, 0);
          }
          continue;
        }

        // Nếu nằm trong ca làm việc → tính tiếp
        const [eh, em] = shift.end.split(":").map(Number);
        const shiftEnd = new Date(current);
        shiftEnd.setHours(eh, em, 0, 0);

        const availableMinutes = Math.floor((shiftEnd - current) / 60000);
        const consumed = Math.min(minutesLeft, availableMinutes);
        current = new Date(current.getTime() + consumed * 60000);
        minutesLeft -= consumed;
      }

      return current;
    };

    const startTime = formData?.date ? new Date(formData.date) : null;
    const doneTime = startTime
      ? addMinutesRespectingWorkHours(startTime, totalMinutes)
      : null;

    // if (doneTime) {
    //   const hour = doneTime.getHours();
    //   const minute = doneTime.getMinutes();
    //   const isAtShiftEnd =
    //     (hour === 12 && minute === 0) || (hour === 17 && minute === 30);

    //   if (isAtShiftEnd) {
    //     do {
    //       doneTime.setDate(doneTime.getDate() + 1);
    //     } while (doneTime.getDay() === 0);

    //     doneTime.setHours(8, 0, 0, 0);
    //   }
    // }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

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

  useEffect(() => {
    if (open) {
      setFormData({
        date: selectedDate,
        appointment_services: [],
      });
      setVehicleInputs(
        initialVehicleInputs.length > 0
          ? initialVehicleInputs
          : [{ key: "", value: "" }]
      );
    }
  }, [open]);

  const handleSave = async () => {
    const { doneTime } = estimatedTotalTime || {};
    const vehicle_ready_time = formatToVNTime(doneTime);
    const payload = {
      ...formData,
      customer: formData.customer?.id,
      title: formData.customer?.full_name,
      status: currentStatus.toLowerCase(),
      appointment_services: formData.appointment_services.map((item) => ({
        service: item.service.id,
        price: item.price,
      })),
      total_price: totalPrice.toFixed(2),
      vehicle_ready_time: vehicle_ready_time || null,
    };
    try {
      await onSave(payload);
      handleClose();
    } catch (error) {
      console.error("Error in handleSave:", error);
      showSnackbar("Failed to save appointment", "error");
    }
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disablePortal
      fullWidth
      maxWidth="md"
    >
      <DialogTitle align="center">APPOINTMENT DETAILS</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} alignItems="stretch">
          {/* Customer Information */}
          <Grid item xs={12} md={6} sx={{ display: "flex" }}>
            <Paper variant="outlined" sx={{ p: 2, flexGrow: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Customer Information
              </Typography>

              <Box>
                <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
                  <InputLabel id="customer-select-label">
                    Select Customer
                  </InputLabel>
                  <Select
                    labelId="customer-select-label"
                    value={formData.customer?.id || ""}
                    label="Select Customer"
                    onChange={handleCustomerChange}
                  >
                    {customers.map((customer) => (
                      <MenuItem key={customer.id} value={customer.id}>
                        {customer.full_name || customer.email}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {loadingCustomer && (
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
                )}
                {formData.customer && (
                  <Box display="flex" flexDirection="column" gap={2}>
                    <Box display="flex" gap={2}>
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
                        {formData.additional_customer_information && (
                          <>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="subtitle2" fontWeight="bold">
                              Additional Information:
                            </Typography>
                            {Object.entries(
                              formData.additional_customer_information
                            ).map(([key, value]) => (
                              <Typography key={key}>
                                {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
                                <Typography
                                  component="span"
                                  fontWeight="medium"
                                >
                                  {value || "N/A"}
                                </Typography>
                              </Typography>
                            ))}
                          </>
                        )}
                      </Box>
                    </Box>

                    <Box>
                      <TextareaAutosize
                        minRows={4}
                        maxRows={10}
                        placeholder="Customer's note for this appointment"
                        value={formData.note}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            note: e.target.value,
                          }))
                        }
                        style={{
                          width: "100%",
                          padding: "8px",
                          fontSize: "16px",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                          resize: "vertical",
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Vehicle Information */}
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
              ) : (
                <Box display="flex" flexDirection={"column"}>
                  <Box mb={2}>
                    {vehicleInputs.map((input, index) => (
                      <Box
                        key={index}
                        display="flex"
                        alignItems="center"
                        gap={1}
                        mb={1.5}
                      >
                        <TextField
                          label="Property"
                          value={input.key}
                          onChange={(e) =>
                            handleVehicleInputChange(
                              index,
                              "key",
                              e.target.value
                            )
                          }
                          size="small"
                          sx={{ flex: 1 }}
                        />
                        <TextField
                          label="Value"
                          value={input.value}
                          onChange={(e) =>
                            handleVehicleInputChange(
                              index,
                              "value",
                              e.target.value
                            )
                          }
                          size="small"
                          sx={{ flex: 1 }}
                        />
                        <IconButton
                          onClick={() => removeVehicleInput(index)}
                          color="error"
                          disabled={vehicleInputs.length === 1}
                          sx={{ p: 0.5 }}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>

                  <Box display="flex" justifyContent="flex-end">
                    <IconButton
                      onClick={addVehicleInput}
                      color="primary"
                      sx={{ p: 0.5 }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
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
            {/* Services list */}
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
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography fontWeight="bold">
                        {s.service.name}
                      </Typography>
                    </Box>
                    <Box sx={{ width: 150, textAlign: "left" }}>
                      {(() => {
                        const priceInfo = getDiscountedPrice(
                          s.service,
                          formData.date
                        );
                        return (
                          <Box>
                            <Typography fontWeight="bold">
                              {priceInfo.final} VND
                            </Typography>
                            {priceInfo.discounted && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  textDecoration: "line-through",
                                  fontSize: "0.75rem",
                                }}
                              >
                                {priceInfo.original} VND
                              </Typography>
                            )}
                          </Box>
                        );
                      })()}
                    </Box>
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
                    <Box sx={{ width: 40, textAlign: "right" }}>
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveService(s.id)}
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
                <DateTimePicker
                  label="Appointment Time"
                  value={formData.date ? dayjs(formData.date) : null}
                  onChange={(newValue) => {
                    const formatted = newValue
                      ?.tz("Asia/Ho_Chi_Minh")
                      ?.format("YYYY-MM-DD HH:mm:ssZ");

                    setFormData((prev) => ({
                      ...prev,
                      date: formatted,
                    }));
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                    },
                  }}
                />

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
                    {estimatedTotalTime.doneTime?.toLocaleString?.() || "N/A"}
                  </Box>
                </Typography>
                <Typography>
                  Total:{" "}
                  <Box component="span" fontWeight="bold">
                    ${totalPrice?.toFixed(2) || "0"}
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
                  Created At:{" "}
                  <Box component="span" fontWeight="bold">
                    {formData.create_at
                      ? new Date(formData.create_at).toLocaleString()
                      : "N/A"}
                  </Box>
                </Typography>
                <Typography>
                  Last Updated:{" "}
                  <Box component="span" fontWeight="bold">
                    {formData.update_at
                      ? new Date(formData.update_at).toLocaleString()
                      : "N/A"}
                  </Box>
                </Typography>
              </Stack>
            </Box>
          </Paper>
        </Box>
      </DialogContent>
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
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </Box>
      </DialogActions>
      <AddServiceDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        services={services}
        onAddServices={handleAddService}
      />
      <CustomSnackbar />
      <LoadingOverlay loading={loading} />
    </Dialog>
  );
};

export default AddAppointmentDialog;
