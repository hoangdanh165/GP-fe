import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  useTheme,
  useMediaQuery,
  MenuItem,
} from "@mui/material";

const UserDialog = ({ open, onClose, onSave, userData, isEditMode = true }) => {
  const [formData, setFormData] = useState(userData || {});

  const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const dialogBackgroundColor = isDarkMode
    ? "rgba(30, 30, 30, 0.7)"
    : "rgba(247, 42, 42, 0.7)";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    setFormData(userData || {});
    console.log(formData);
  }, [userData]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        backgroundColor: dialogBackgroundColor,
      }}
    >
      <DialogTitle alignSelf={"center"}>
        {isEditMode ? "EDIT USER" : "CREATE USER"}
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Full Name"
          name="fullName"
          disabled={isEditMode}
          value={formData.fullName || ""}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          margin="normal"
          select
        >
          <MenuItem value="customer">Customer</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="sale">Sale</MenuItem>
        </TextField>
        <TextField
          fullWidth
          label="Address"
          name="address"
          disabled={isEditMode}
          value={formData.address || ""}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Email"
          disabled={isEditMode}
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
          margin="normal"
        />
        {!isEditMode && (
          <TextField
            fullWidth
            label="Password"
            disabled={isEditMode}
            name="password"
            value={formData.password || ""}
            onChange={handleChange}
            margin="normal"
          />
        )}
        <TextField
          fullWidth
          label="Email Verified"
          name="emailVerified"
          value={
            formData.emailVerified === true
              ? true
              : formData.emailVerified === false
              ? false
              : true
          }
          onChange={handleChange}
          margin="normal"
          select
        >
          <MenuItem value={true}>Verified</MenuItem>
          <MenuItem value={false}>Not Verified</MenuItem>
        </TextField>
        <TextField
          fullWidth
          label="Account Status"
          name="accountStatus"
          value={
            formData.accountStatus !== undefined &&
            formData.accountStatus !== ""
              ? parseInt(formData.accountStatus)
              : 1
          }
          onChange={handleChange}
          margin="normal"
          select
        >
          <MenuItem value={1}>Active</MenuItem>
          <MenuItem value={0}>Banned</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={() => onSave(formData)} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDialog;
