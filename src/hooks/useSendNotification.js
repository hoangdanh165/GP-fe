import { useCallback, useState } from "react";
import axios from "axios";

const NODE_JS_HOST = import.meta.env.VITE_NODE_JS_HOST;

const notificationTemplates = {
  APPOINTMENT_CONFIRMED: ({ time }) => ({
    message: `Your appointment has been confirmed. See you at ${time}.`,
  }),

  APPOINTMENT_CREATED_CUSTOMER: ({ time }) => ({
    message: `You have successfully booked an appointment at ${time}.`,
  }),

  APPOINTMENT_CREATED_STAFF: ({ customerName, time }) => ({
    message: `${customerName} just booked an appointment at ${time}.`,
  }),

  APPOINTMENT_CANCELLED: ({ time }) => ({
    message: `Your appointment on ${time} has been cancelled. Please contact the garage for more information.`,
  }),

  APPOINTMENT_UPDATED: ({ time }) => ({
    message: `Your appointment on ${time} has been updated. Please check for details.`,
  }),

  VEHICLE_READY: ({ time }) => ({
    message: `Your vehicle is ready at ${time}. You can come to pick it up during working hours.`,
  }),

  REMINDER_1_DAY: ({ time }) => ({
    message: `You have an appointment tomorrow at ${time}. Please be on time!`,
  }),

  REMINDER_1_HOUR: ({ time }) => ({
    message: `You have an appointment in 1 hour at ${time}. Please be ready!`,
  }),

  FEEDBACK_REQUEST: () => ({
    message: `Are you satisfied with the service? Leave us a review!`,
  }),

  SERVICE_NOTE_UPDATED: ({ content }) => ({
    message: `Your appointment has been updated with the following note: ${content}`,
  }),
};

const useSendNotification = () => {
  const [error, setError] = useState(null);

  const sendNotification = useCallback(
    async ({
      type,
      params,
      create_url = null,
      extra_data = null,
      user_id = null,
      roles = null,
    }) => {
      try {
        const template = notificationTemplates[type];
        if (!template) throw new Error(`No template found for type ${type}`);

        const { message } = template(params || {});

        await axios.post(`${NODE_JS_HOST}/api/v1/notifications`, {
          user_id,
          roles,
          message,
          params,
          create_url,
          extra_data,
        });
      } catch (err) {
        console.error("Failed to send notification:", err);
        setError("Failed to send notification.");
      }
    },
    []
  );

  return {
    sendNotification,
    error,
  };
};

export default useSendNotification;
