import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { useRecoilState } from "recoil";
import { servicesAtom } from "../../../atoms/servicesAtom";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { enUS, se } from "date-fns/locale";
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
  const [open, setOpen] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [services, setServices] = useRecoilState(servicesAtom);

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
  }, [axiosPrivate]);

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

  const handleSelectSlot = ({ start, end }) => {
    const title = prompt("Nhập tiêu đề lịch hẹn:");
    if (title) {
      setEvents([...events, { start, end, title }]);
    }
  };

  const handleSelectEvent = async (event) => {
    setSelectedEvent(event);
    setAppointmentDetails(null);
    setOpen(true);
    setLoading(true);
    try {
      const response = await axiosPrivate.get(
        `/api/v1/appointments/${event.id}/details/`
      );
      setAppointmentDetails(response.data);
    } catch (error) {
      console.error("Error fetching appointment details:", error);
      showSnackbar("Error fetching appointment details", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async () => {};

  const onRemoveService = (serviceId) => {};

  const handleSave = async (data) => {
    try {
      const response = await axiosPrivate.post(
        `/api/v1/appointments/${selectedEvent.id}/details/`,
        data
      );
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEvent.id ? { ...event, ...data } : event
        )
      );
      showSnackbar("Appointment updated successfully", "success");
    } catch (error) {
      console.error("Error saving appointment:", error);
      showSnackbar("Error saving appointment", "error");
    } finally {
      setOpen(false);
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
      <AppointmentDialog
        open={open}
        onClose={() => setOpen(false)}
        appoinmentData={appointmentDetails}
        onSave={handleSave}
        onAddService={handleAddService}
        onRemoveService={onRemoveService}
        loading={loading}
      />
      <CustomSnackbar />
    </Box>
  );
};

export default CustomerCalendar;
