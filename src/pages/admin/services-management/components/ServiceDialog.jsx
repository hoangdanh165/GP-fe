import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  MenuItem,
  useMediaQuery,
  Typography,
} from "@mui/material";

const ServiceDialog = ({
  open,
  onClose,
  onSave,
  serviceData,
  isEditMode = true,
  categoryOptions = [],
}) => {
  const [formData, setFormData] = useState(serviceData || {});

  const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const dialogBackgroundColor = isDarkMode
    ? "rgba(30, 30, 30, 0.7)"
    : "rgba(247, 247, 247, 0.9)";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    setFormData(serviceData || {});
  }, [serviceData]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{ backgroundColor: dialogBackgroundColor }}
    >
      <DialogTitle alignSelf="center">
        {isEditMode ? "EDIT SERVICE" : "CREATE SERVICE"}
      </DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          label="Service Name"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Category"
          name="category"
          value={formData.category || ""}
          onChange={handleChange}
          margin="normal"
          select
        >
          {categoryOptions.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
          <MenuItem value="new">Add New Category</MenuItem>
        </TextField>

        {formData.category === "new" && (
          <Box>
            <TextField
              fullWidth
              label="New Category Name"
              name="new_category"
              value={formData.new_category || ""}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="New Category Description"
              name="new_category_description"
              value={formData.new_category_description || ""}
              onChange={handleChange}
              margin="normal"
            />
          </Box>
        )}
        <TextField
          fullWidth
          label="Price (VND)"
          name="price"
          type="number"
          value={formData.price || ""}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Estimated Duration (hh:mm:ss)"
          name="estimated_duration"
          type="text"
          value={formData.estimated_duration || ""}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Discount (%)"
          name="discount"
          type="number"
          value={formData.discount || ""}
          onChange={handleChange}
          margin="normal"
        />
        <Typography variant="subtitle2" color="primary" mt={2}>
          Discount From
        </Typography>
        <TextField
          fullWidth
          name="discount_from"
          type="datetime-local"
          value={
            formData.discount_from ? formData.discount_from.slice(0, 16) : ""
          }
          onChange={handleChange}
          margin="normal"
        />

        <Typography variant="subtitle2" color="primary" mt={2}>
          Discount To
        </Typography>
        <TextField
          fullWidth
          name="discount_to"
          type="datetime-local"
          value={formData.discount_to ? formData.discount_to.slice(0, 16) : ""}
          onChange={handleChange}
          margin="normal"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={() => onSave(formData)} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServiceDialog;
