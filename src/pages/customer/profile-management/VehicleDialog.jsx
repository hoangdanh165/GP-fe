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

const VehicleDialog = ({
  open,
  onClose,
  onSave,
  carData,
  isEditMode = true,
}) => {
  const [formData, setFormData] = useState(carData || {});

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
    setFormData(carData || {});
    console.log(formData);
  }, [carData]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        backgroundColor: dialogBackgroundColor,
      }}
    >
      <DialogTitle alignSelf={"center"}>
        {isEditMode ? "EDIT VEHICLE" : "ADD VEHICLE"}
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Brand"
          name="brand"
          disabled={isEditMode}
          value={formData.brand || ""}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Year"
          type="number"
          name="year"
          value={formData.year || ""}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Color"
          name="color"
          value={formData.color || ""}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Engine Type"
          name="engineType"
          value={formData.engineType || ""}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="License Plate"
          name="licensePlate"
          value={formData.licensePlate || ""}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Registration Provine"
          name="registrationProvince"
          value={formData.registrationProvince || ""}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Current Odometer"
          name="currentOdometer"
          value={formData.currentOdometer || ""}
          onChange={handleChange}
          margin="normal"
          type="number"
        />
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

export default VehicleDialog;
