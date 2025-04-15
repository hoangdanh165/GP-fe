import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { useRecoilState } from "recoil";
import { servicesAtom } from "../../../atoms/servicesAtom";
import { customersAtom } from "../../../atoms/customersAtom";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { ca, enUS, se } from "date-fns/locale";
import { Box, Typography } from "@mui/material";
import AddAppointmentDialog from "./AddAppointmentDialog";
import useShowSnackbar from "./../../../hooks/useShowSnackbar";
import useAxiosPrivate from "./../../../hooks/useAxiosPrivate";
import AppointmentDialog from "./AppointmentDialog";
import useSendNotification from "../../../hooks/useSendNotification";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

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
  const { sendNotification } = useSendNotification();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [open, setOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [services, setServices] = useRecoilState(servicesAtom);
  const [customers, setCustomers] = useRecoilState(customersAtom);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosPrivate.get("/api/v1/appointments/");
        const data = response.data.map((event) => ({
          id: event.id,
          start: new Date(event.date),
          end: new Date(event.vehicle_ready_time),
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

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axiosPrivate.get("/api/v1/users/get-customers/");
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
        showSnackbar("Error fetching services", "error");
      }
    };
    fetchCustomers();
  }, [axiosPrivate]);

  const handleSelectSlot = ({ start, end }) => {
    // setSelectedDate(dayjs(start).toDate());
    // setAddDialogOpen(true);
    sendNotification({
      user_id: "05529d78-ce43-44e8-9e54-2e5fbd27da2f",
      params: { time: "2025-04-02 00:00:00+07:00" },
      type: "WEB",
      reminder_type: "APPOINTMENT_REMINDER_1_HOUR",
    });
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

  const handleSaveAdd = async (formData) => {
    setLoading(true);
    console.log(formData);
    if (
      !formData.date ||
      !formData.title ||
      !formData.customer ||
      !formData.vehicle_information ||
      !formData.appointment_services?.length ||
      !formData.status ||
      !formData.total_price ||
      !formData.vehicle_ready_time
    ) {
      showSnackbar("Please fill all neccessary fields!", "warning");
      setLoading(false);
      throw new Error("Missing required fields");
    }
    try {
      const response = await axiosPrivate.post(
        "/api/v1/appointments/",
        formData
      );
      if (response.data) {
        const newEvent = {
          id: response.data?.id,
          start: new Date(formData.date),
          end: new Date(formData.vehicle_ready_time),
          title: formData.title,
        };
        setEvents((prevEvents) => [...prevEvents, newEvent]);
      }
      showSnackbar("Appointment added successfully", "success");
    } catch (error) {
      console.error("Error adding appointment:", error);
      showSnackbar("Error adding appointment", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUpdate = async (formData) => {
    setLoading(true);
    console.log(formData, selectedEvent.id);
    if (
      !formData.date ||
      !formData.customer ||
      !formData.vehicle_information ||
      !formData.appointment_services?.length ||
      !formData.status ||
      !formData.total_price ||
      !formData.vehicle_ready_time
    ) {
      showSnackbar("Please fill all neccessary fields!", "warning");
      setLoading(false);
      throw new Error("Missing required fields");
    }
    try {
      const response = await axiosPrivate.put(
        `/api/v1/appointments/${selectedEvent.id}/update/`,
        formData
      );
      if (response.data.detail) {
        showSnackbar(response.data.detail, "success");
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === selectedEvent.id
              ? {
                  ...event,
                  start: new Date(formData.date),
                  end: new Date(formData.vehicle_ready_time),
                  title: response.data.data.title,
                }
              : event
          )
        );
        setOpen(false);
      }
    } catch (error) {
      console.error("Error saving appointment:", error);
      showSnackbar("Error saving appointment", "error");
    } finally {
      setLoading(false);
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
        onSave={handleSaveUpdate}
        loading={loading}
      />
      <AddAppointmentDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        selectedDate={selectedDate}
        onSave={handleSaveAdd}
        loading={loading}
      />
      <CustomSnackbar />
    </Box>
  );
};

export default CustomerCalendar;
