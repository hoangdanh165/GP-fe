import React, { useEffect, useState } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Paper,
  Box,
  LinearProgress,
  Divider,
  Stack,
} from "@mui/material";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useSocket } from "../../../contexts/SocketContext";

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const { socket } = useSocket();

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
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment.id === formData.id ? formData : appointment
          )
        );
        console.log("✅ Cập nhật appointment từ WebSocket:", formData.id);
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

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Appointment History
      </Typography>
      <List>
        {appointments.map((item) => {
          const progress = calculateProgress(item.appointment_services);
          return (
            <Paper key={item.id} elevation={3} sx={{ mb: 2, p: 2 }}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={`Appointment on ${new Date(
                    item.date
                  ).toLocaleString()}`}
                  secondary={
                    <Box mt={1}>
                      <Typography variant="body2" gutterBottom>
                        Vehicle:{" "}
                        <strong>{item.vehicle_information?.name}</strong> -{" "}
                        <strong>
                          {item.vehicle_information?.license_plate_number}
                        </strong>
                      </Typography>

                      <Typography variant="body2" gutterBottom>
                        Status: <strong>{item.status}</strong>
                      </Typography>

                      <Typography variant="body2" gutterBottom>
                        Vehicle Ready Time:{" "}
                        <strong>{`${new Date(
                          item.date
                        ).toLocaleString()}`}</strong>
                      </Typography>

                      <Box mt={1}>
                        <Typography variant="body2" gutterBottom>
                          Services:
                        </Typography>
                        <ul style={{ marginTop: 0 }}>
                          {item.appointment_services.map((svc) => (
                            <li key={svc.id}>
                              {svc.service.name}{" "}
                              {svc.completed
                                ? "(Completed ✅)"
                                : "(Processing ⏳)"}
                            </li>
                          ))}
                        </ul>
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
                    </Box>
                  }
                />
              </ListItem>
            </Paper>
          );
        })}
      </List>
    </Box>
  );
};

export default AppointmentsList;
