import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  IconButton,
  Button,
  MenuItem,
  Grid,
  CircularProgress,
  Stack,
  Paper,
} from "@mui/material";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import AddServiceDialog from "../../admin/appointments-management/AddServiceDialog";
import useAuth from "../../../hooks/useAuth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useRecoilState } from "recoil";
import { servicesAtom } from "../../../atoms/servicesAtom";
import useShowSnackbar from "../../../hooks/useShowSnackbar";
import paths from "../../../routes/paths";
import { useNavigate } from "react-router-dom";
import axios from "axios";

dayjs.extend(utc);
dayjs.extend(timezone);
const NODE_JS_HOST = import.meta.env.VITE_NODE_JS_HOST;

const BookYourAppointment = () => {
  const { auth } = useAuth();
  const [cars, setCars] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(false);
  const [vehicleInputs, setVehicleInputs] = useState([{ key: "", value: "" }]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [services, setServices] = useRecoilState(servicesAtom);
  const { showSnackbar, CustomSnackbar } = useShowSnackbar();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: auth?.fullName || null,
    phone: auth?.phone || null,
    email: auth?.email || null,
    address: auth?.address || null,
    carInfo: null,
    vehicle_information: null,
    date: null,
    note: null,
    status: "pending",
    total_price: null,
    title: auth?.fullName,
    pickup_time: null,
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axiosPrivate.get("/api/v1/services/");
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
        showSnackbar("Error fetching services", "error");
      }
    };
    fetchServices();
  }, [axiosPrivate]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const formatToVNTime = (date) => {
    return dayjs(date).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm:ssZ");
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axiosPrivate.get("/api/v1/cars/");
        setCars(response.data);
      } catch (error) {
        console.error("Failed to fetch cars:", error);
      }
    };

    fetchCars();
  }, []);

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

  const addVehicleInput = () => {
    setVehicleInputs([...vehicleInputs, { key: "", value: "" }]);
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

  const handleVehicleSelect = (event) => {
    setVehicleInputs(null);
    const value = event.target.value;

    setFormData((prev) => ({
      ...prev,
      carInfo: value,
    }));

    if (value === "__") {
      const defaultFields = [
        "name",
        "brand",
        "color",
        "year",
        "engine_type",
        "current_odometer",
        "license_plate",
        "registration_province",
        "vin",
      ];

      const emptyInputs = defaultFields.map((key) => ({ key, value: "" }));

      setFormData((prev) => ({
        ...prev,
        carInfo: value,
        vehicle_information: {},
      }));

      setVehicleInputs(emptyInputs);
      return;
    }

    const selectedCar = cars.find((car) => car.id === value);

    const filteredEntries = Object.entries(selectedCar).filter(
      ([key]) => !["id", "user", "create_at", "update_at"].includes(key)
    );

    const filteredInputs = filteredEntries.map(([key, value]) => ({
      key,
      value,
    }));

    const vehicleInfoObject = Object.fromEntries(filteredEntries);

    setFormData((prev) => ({
      ...prev,
      carInfo: value,
      vehicle_information: vehicleInfoObject,
    }));

    setVehicleInputs(filteredInputs);
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

  const getResetFormData = (auth) => ({
    name: auth?.fullName || null,
    phone: auth?.phone || null,
    email: auth?.email || null,
    address: auth?.address || null,
    carInfo: null,
    vehicle_information: null,
    date: null,
    note: null,
    status: "pending",
    total_price: null,
    title: auth?.fullName,
    pickup_time: null,
  });

  const handleSubmit = async () => {
    setLoading(true);

    const missingFields = [];

    if (!formData.date) missingFields.push("Appointment Time");
    if (!formData.vehicle_information)
      missingFields.push("Vehicle Information");
    if (!formData.appointment_services?.length) missingFields.push("Services");

    if (missingFields.length > 0) {
      const message = `Please fill the following fields: ${missingFields.join(
        ", "
      )}`;
      showSnackbar(message, "warning");
      setLoading(false);
      return;
    }

    const { doneTime } = estimatedTotalTime || {};
    const vehicle_ready_time = formatToVNTime(doneTime);

    const { name, phone, email, address, carInfo, ...cleanedFormData } =
      formData;

    const payload = {
      ...cleanedFormData,
      customer: auth?.userId,
      title: auth?.fullName,
      appointment_services: formData.appointment_services.map((item) => ({
        service: item.service.id,
        price: item.price,
      })),
      total_price: totalPrice.toFixed(2),
      vehicle_ready_time: vehicle_ready_time || null,
    };

    console.log("PAYLOAD", payload);

    try {
      const response = await axiosPrivate.post(
        "/api/v1/appointments/",
        payload
      );
      const updateData = {
        id: response.data.id,
        date: response.data.date,
        vehicle_ready_time: response.data.vehicle_ready_time,
        title: response.data.title,
      };

      await axios.post(`${NODE_JS_HOST}/api/v1/appointments/new`, {
        formData: updateData,
      });

      showSnackbar("Appointment booked successfully!", "success");
      navigate(paths.appointments_history);
    } catch (error) {
      console.error("Error booking appointment:", error);
      showSnackbar("Error booking appointment", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4} maxWidth={600} mx="auto">
      {loading && (
        <Box
          position="fixed"
          top={0}
          left={0}
          width="100vw"
          height="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={2000}
          sx={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        >
          <CircularProgress color="primary" />
        </Box>
      )}

      <Typography variant="h6" gutterBottom>
        Personal Information
      </Typography>
      <TextField
        fullWidth
        disabled
        margin="normal"
        label="Full Name"
        value={formData.name}
        onChange={handleChange("name")}
      />
      <TextField
        fullWidth
        disabled
        margin="normal"
        label="Phone"
        value={formData.phone}
        onChange={handleChange("phone")}
      />
      <TextField
        fullWidth
        disabled
        margin="normal"
        label="Address"
        value={formData.address}
        onChange={handleChange("address")}
      />
      <TextField
        fullWidth
        disabled
        margin="normal"
        label="Email"
        value={formData.email}
        onChange={handleChange("email")}
      />

      <Typography variant="h6" mt={3} gutterBottom>
        Vehicle Information
      </Typography>
      <TextField
        fullWidth
        select
        margin="normal"
        label="Select Your Vehicle"
        value={formData.carInfo}
        onChange={handleVehicleSelect}
      >
        {cars.map((car) => (
          <MenuItem key={car.id} value={car.id}>
            {car.name} - {car.license_plate}
          </MenuItem>
        ))}
        <MenuItem value="__">Enter a new one</MenuItem>
      </TextField>

      {formData.carInfo && (
        <Grid item xs={12} md={6} sx={{ display: "flex" }}>
          <Paper variant="outlined" sx={{ p: 2, flexGrow: 1 }}>
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
                          handleVehicleInputChange(index, "key", e.target.value)
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
      )}
      <Typography variant="h6" mt={3} gutterBottom>
        Appointment Time
      </Typography>
      <TextField
        fullWidth
        margin="normal"
        label="Date & Time"
        type="datetime-local"
        InputLabelProps={{ shrink: true }}
        value={formData.date}
        onChange={handleChange("date")}
      />

      <Typography variant="h6" mt={3} gutterBottom>
        Services
      </Typography>
      <Paper variant="outlined" sx={{ p: 2 }}>
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
                  <Typography fontWeight="bold">{s.service.name}</Typography>
                </Box>
                <Box sx={{ width: 80, textAlign: "left" }}>
                  {(() => {
                    const priceInfo = getDiscountedPrice(
                      s.service,
                      formData.date
                    );
                    return (
                      <Box>
                        <Typography fontWeight="bold">
                          ${priceInfo.final}
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
                            ${priceInfo.original}
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
            <Typography>
              Estimated Service Duration:{" "}
              <Box component="span" fontWeight="bold">
                {estimatedTotalTime.hours} hours {estimatedTotalTime.minutes}{" "}
                minutes
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
          <Button startIcon={<AddIcon />} onClick={() => setIsDialogOpen(true)}>
            Add Service
          </Button>
        </Box>
      </Paper>

      <Typography variant="h6" mt={3} gutterBottom>
        Note (optional)
      </Typography>
      <TextareaAutosize
        minRows={4}
        maxRows={10}
        placeholder="Your note for this appointment"
        value={formData.note}
        onChange={handleChange("note")}
        style={{
          width: "100%",
          padding: "8px",
          fontSize: "16px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          resize: "vertical",
        }}
      />

      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="secondary"
          startIcon={loading ? null : <AccessTimeIcon />}
          onClick={handleSubmit}
          disabled={loading}
          style={{ minWidth: "150px" }}
        >
          {loading ? (
            <>
              <CircularProgress
                size={24}
                color="white"
                style={{ marginRight: 8 }}
              />
              Booking...
            </>
          ) : (
            "Book!"
          )}
        </Button>
      </Box>

      <AddServiceDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        services={services}
        onAddServices={handleAddService}
      />
      <CustomSnackbar />
    </Box>
  );
};

export default BookYourAppointment;
