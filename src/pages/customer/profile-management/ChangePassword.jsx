import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import useAxiosPrivate from "./../../../hooks/useAxiosPrivate";
import useShowSnackbar from "./../../../hooks/useShowSnackbar";

const ChangePassword = ({ open, onClose }) => {
  const { showSnackbar, CustomSnackbar } = useShowSnackbar();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const axiosPrivate = useAxiosPrivate();

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showSnackbar("Please fill in all the fields.", "error");
      return;
    }

    if (newPassword.length < 8) {
      showSnackbar("New password must be at least 8 characters.", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showSnackbar("New password and confirmation do not match.", "error");

      return;
    }
    try {
      const response = await axiosPrivate.post(
        "/api/v1/users/change-password/",
        {
          current_password: currentPassword,
          new_password: newPassword,
        }
      );
      showSnackbar(response.data.message, "error");
      handleCloseChangePasswordModal();
    } catch (error) {
      console.error("Error changing password:", error);
      showSnackbar(error.response.data.error, "error");
      console.log(error);
    }
  };

  const handleCloseChangePasswordModal = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  return (
    <Box>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle sx={{ marginTop: 5, alignSelf: "center" }}>
          CHANGE PASSWORD
        </DialogTitle>
        <DialogContent>
          <Box
            display="flex"
            width="500px"
            flexDirection="column"
            gap={2}
            marginBottom={3}
          >
            <TextField
              label="Current Password"
              type={"text"}
              fullWidth
              margin="dense"
              variant="outlined"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <TextField
              label="New Password"
              type={"text"}
              fullWidth
              margin="dense"
              variant="outlined"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <TextField
              label="Confirm New Password"
              type={"text"}
              fullWidth
              margin="dense"
              variant="outlined"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Box
            display="flex"
            flexDirection="row"
            gap={1}
            width="100%"
            marginBottom={5}
          >
            <Button
              onClick={handleCloseChangePasswordModal}
              color="error"
              variant="outlined"
              sx={{ width: "30%", height: "40px", margin: "0 auto" }}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              variant="outlined"
              onClick={handleChangePassword}
              sx={{ width: "30%", height: "40px", margin: "0 auto" }}
            >
              Change Password
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
      <CustomSnackbar />
    </Box>
  );
};

export default ChangePassword;
