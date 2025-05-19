import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import OutlinedInput from "@mui/material/OutlinedInput";
import axios from "axios";
import useShowSnackbar from "../../../../hooks/useShowSnackbar";
import { Box } from "@mui/material";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

export default function ForgotPassword({
  open,
  handleClose,
}: ForgotPasswordProps) {
  const [email, setEmail] = React.useState("");
  const { showSnackbar, CustomSnackbar } = useShowSnackbar();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/v1/users/forgot-password/`, {
        email,
      });
      handleClose();
    } catch (error) {
      console.error("Failed to send reset email:", error);
      showSnackbar("Failed to send reset email. Please try again.", "error");
    }
  };
  return (
    <Box>
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: "form",
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              handleClose();
            },
            sx: { backgroundImage: "none" },
          },
        }}
      >
        <DialogTitle>Reset password</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
          }}
        >
          <DialogContentText>
            Enter your account&apos;s email address, and we&apos;ll send you a
            link to reset your password.
          </DialogContentText>
          <OutlinedInput
            autoFocus
            required
            margin="dense"
            id="email"
            name="email"
            label="Email address"
            placeholder="Email address"
            type="email"
            fullWidth
            onChange={(e) => setEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ pb: 3, px: 3 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Continue
          </Button>
        </DialogActions>
      </Dialog>
      <CustomSnackbar />
    </Box>
  );
}
