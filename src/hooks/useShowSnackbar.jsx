import { useState, useCallback } from "react";
import { Snackbar, Alert } from "@mui/material";

const useShowSnackbar = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showSnackbar = useCallback((message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const Snackbar = () => (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={3000}
      onClose={closeSnackbar}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={closeSnackbar}
        severity={snackbar.severity}
        variant="filled"
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );

  return { showSnackbar, Snackbar };
};

export default useShowSnackbar;
