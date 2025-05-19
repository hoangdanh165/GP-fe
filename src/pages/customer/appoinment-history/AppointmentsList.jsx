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
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useSocket } from "../../../contexts/SocketContext";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import UpdateIcon from "@mui/icons-material/Update";
import Feedback from "./Feedback";

dayjs.extend(utc);
dayjs.extend(timezone);

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const { socket } = useSocket();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axiosPrivate.get(
          "/api/v1/appointments/my-appointments/"
        );
        setAppointments(response.data);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    socket.on("newUpdatesOfAppoinment", (formData) => {
      if (formData && formData.id) {
        console.log(formData);
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment.id === formData.id ? formData : appointment
          )
        );
        console.log("Cập nhật appointment từ WebSocket:", formData.id);
      }
    });

    return () => {
      socket.off("newUpdatesOfAppoinment");
    };
  }, [socket]);

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

  if (appointments.length === 0) {
    return (
      <Typography variant="h6" align="center" mt={4}>
        No appointments found.
      </Typography>
    );
  }

  const statusColors = {
    PENDING: "warning",
    CONFIRMED: "info",
    PROCESSING: "info",
    COMPLETED: "success",
    CANCELED: "error",
  };

  const handleSendFeedback = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setFeedbackOpen(true);
  };

  const handleViewFeedback = async (appointmentId) => {
    setEditMode(true);
    try {
      const response = await axiosPrivate.get(
        `/api/v1/feedbacks/get-by-appointment/?appointment_id=${appointmentId}`
      );
      setSelectedFeedback(response.data);
      setFeedbackOpen(true);
    } catch (error) {
      console.error("Failed to fetch feedback:", error);
    }

    setFeedbackOpen(true);
  };

  const onCloseFeedback = () => {
    setEditMode(false);
    setFeedbackOpen(false);
  };

  const handleFeedbackSuccess = () => {
    setAppointments((prev) =>
      prev.map((item) =>
        item.id === selectedAppointmentId
          ? { ...item, feedback_sent: true }
          : item
      )
    );
    setFeedbackOpen(false);
  };

  return (
    <Box p={3}>
      <List>
        {appointments.map((item) => {
          const progress = calculateProgress(item.appointment_services);
          return (
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
                          Appointment on {new Date(item.date).toLocaleString()}{" "}
                          for {item.vehicle_information?.name} -{" "}
                          {item.vehicle_information?.license_plate_number ||
                            item.vehicle_information?.license_plate}{" "}
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
                        Vehicle Ready Time:{" "}
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ fontWeight: "bold !important" }}
                        >
                          {item.vehicle_ready_time
                            ? new Date(item.vehicle_ready_time).toLocaleString()
                            : "N/A"}
                        </Typography>
                      </Typography>

                      <Box mt={1}>
                        <Typography variant="body2" gutterBottom>
                          Services:
                        </Typography>
                        <List disablePadding>
                          {item.appointment_services.map((svc) => (
                            <ListItem key={svc.id} disablePadding>
                              <ListItemText
                                primary={
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    gap={1}
                                  >
                                    <Typography variant="body2">
                                      - {svc.service?.name || svc.service_name}
                                    </Typography>
                                    <Chip
                                      label={
                                        svc.completed
                                          ? "Completed"
                                          : "Processing"
                                      }
                                      color={svc.completed ? "success" : "info"}
                                      size="small"
                                      variant="filled"
                                    />
                                  </Box>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                        <Typography variant="body2" gutterBottom>
                          Total:{" "}
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{ fontWeight: "bold !important" }}
                          >
                            {item.total_price}
                          </Typography>
                        </Typography>
                      </Box>

                      <Box mt={2}>
                        <Typography variant="body2" gutterBottom>
                          Completion Progress:
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Box width="100%">
                            <LinearProgress
                              variant="determinate"
                              value={progress}
                            />
                          </Box>
                          <Typography
                            variant="body2"
                            width={40}
                            textAlign="right"
                          >
                            {progress}%
                          </Typography>
                        </Stack>
                      </Box>
                      <Stack
                        direction="row"
                        spacing={1}
                        mt={1}
                        alignItems="center"
                      >
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          width="100%"
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

                          {item.status === "completed" && (
                            <>
                              {!item.feedback_sent ? (
                                <Button
                                  variant="outlined"
                                  color="secondary"
                                  onClick={() => handleSendFeedback(item.id)}
                                >
                                  Send Feedback
                                </Button>
                              ) : (
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  onClick={() => handleViewFeedback(item.id)}
                                >
                                  View Feedback
                                </Button>
                              )}
                            </>
                          )}
                        </Box>
                      </Stack>
                    </Box>
                  }
                />
              </ListItem>
            </Paper>
          );
        })}
      </List>
      <Feedback
        open={feedbackOpen}
        onClose={onCloseFeedback}
        onSuccess={handleFeedbackSuccess}
        appointmentId={selectedAppointmentId}
        feedbackData={selectedFeedback}
        editMode={editMode}
      />
    </Box>
  );
};

export default AppointmentsList;
