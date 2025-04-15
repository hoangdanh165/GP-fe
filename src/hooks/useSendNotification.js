import { useCallback, useState } from "react";
import axios from "axios";

const NODE_JS_HOST = import.meta.env.VITE_NODE_JS_HOST;

const useSendNotification = () => {
  const [error, setError] = useState(null);

  const sendNotification = useCallback(
    async ({
      user_id = null,
      roles = null,
      type = null,
      reminder_type = null,
      params = null,
      create_url = null,
      extra_data = null,
    }) => {
      try {
        await axios.post(`${NODE_JS_HOST}/api/v1/notifications`, {
          user_id: user_id || null,
          roles: roles || null,
          type: type || null,
          reminder_type: reminder_type || null,
          params: params || null,
          create_url: create_url || null,
          extra_data: extra_data || null,
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
