import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { enUS } from "date-fns/locale";
import { Box, Typography } from "@mui/material";
import useShowSnackbar from "./../../../hooks/useShowSnackbar";
import useAxiosPrivate from "./../../../hooks/useAxiosPrivate";
import AppointmentDialog from "./AppointmentDialog";
const locales = {
  en: enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CustomerCalendar = () => {
  const axiosPrivate = useAxiosPrivate();
  const { showSnackbar, CustomSnackbar } = useShowSnackbar();

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosPrivate.get("/api/v1/appointments/");
        const data = response.data.map((event) => ({
          id: event.id,
          start: new Date(event.date),
          end: new Date(event.estimated_end_time),
          title: event.title,
          note: event.note,
        }));
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
        showSnackbar("Error fetching events", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleSelectSlot = ({ start, end }) => {
    const title = prompt("Nhập tiêu đề lịch hẹn:");
    if (title) {
      setEvents([...events, { start, end, title }]);
    }
  };

  const handleSelectEvent = async (event) => {
    setSelectedEvent(event);
    setAppointmentDetails(null);
    setIsDialogOpen(true);
    try {
      const response = await axiosPrivate.get(
        `/api/v1/appointments/${event.id}/details/`
      );
      setAppointmentDetails(response.data);
    } catch (error) {
      console.error("Error fetching appointment details:", error);
      showSnackbar("Error fetching appointment details", "error");
    }
  };

  return (
    <Box
      width="100%"
      overflow="auto"
      position="relative"
      display="flex"
      sx={{ height: "100vh", width: "100%", maxWidth: "165vh" }}
    >
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        style={{ height: "80vh", width: "100%" }}
        className="bg-white dark:bg-gray-800 text-black dark:text-white rounded shadow"
      />
      <CustomSnackbar />
    </Box>
  );
};

export default CustomerCalendar;
