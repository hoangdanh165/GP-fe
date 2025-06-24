import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  useMediaQuery,
  List,
  ListItemButton,
  ListItemText,
  Paper,
} from "@mui/material";

const VehicleDialog = ({
  open,
  onClose,
  onSave,
  carData,
  isEditMode = true,
}) => {
  const [formData, setFormData] = useState(carData || {});
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [brandInput, setBrandInput] = useState("");
  const [modelInput, setModelInput] = useState("");
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);

  const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const dialogBackgroundColor = isDarkMode
    ? "rgba(30, 30, 30, 0.7)"
    : "rgba(247, 42, 42, 0.7)";

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "brand") {
      setBrandInput(value);
      const filtered = brands.filter((b) =>
        b.Make_Name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredBrands(filtered);
    } else if (name === "model") {
      setModelInput(value);
      const filtered = models.filter((m) =>
        m.Model_Name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredModels(filtered);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelectBrand = (brandName) => {
    setFormData((prev) => ({
      ...prev,
      brand: brandName,
      model: "",
    }));
    setBrandInput(brandName);
    setFilteredBrands([]);
    setModelInput("");
    setModels([]);
    setFilteredModels([]);
    fetchModels(brandName);
  };

  const handleSelectModel = (modelName) => {
    setModelInput(modelName);
    setFilteredModels([]);
  };

  const fetchModels = async (brand) => {
    try {
      const res = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${brand}?format=json`
      );
      const data = await res.json();
      setModels(data.Results || []);
    } catch (err) {
      console.error("Failed to fetch models", err);
    }
  };

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch(
          "https://vpic.nhtsa.dot.gov/api/vehicles/GetAllMakes?format=json"
        );
        const data = await res.json();
        setBrands(data.Results || []);
      } catch (err) {
        console.error("Failed to fetch brands", err);
      }
    };

    if (open) {
      fetchBrands();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      setFormData({});
      setBrandInput("");
      setModelInput("");
      setFilteredBrands([]);
      setFilteredModels([]);
      setModels([]);
    }
  }, [open]);

  useEffect(() => {
    setFormData(carData || {});
    setBrandInput(carData?.brand || "");
    setModelInput(carData?.name || "");
  }, [carData]);

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - 1989 }, (_, i) => 1990 + i);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{ backgroundColor: dialogBackgroundColor }}
    >
      <DialogTitle align="center">
        {isEditMode ? "EDIT VEHICLE" : "ADD VEHICLE"}
      </DialogTitle>
      <DialogContent>
        {/* Brand (searchable) */}
        <TextField
          fullWidth
          label="Brand"
          name="brand"
          value={brandInput}
          onChange={handleChange}
          margin="normal"
          autoComplete="off"
        />
        {filteredBrands.length > 0 && (
          <Paper elevation={3} sx={{ maxHeight: 200, overflowY: "auto" }}>
            <List dense>
              {filteredBrands.slice(0, 10).map((b) => (
                <ListItemButton
                  key={b.Make_ID}
                  onClick={() => handleSelectBrand(b.Make_Name)}
                >
                  <ListItemText primary={b.Make_Name} />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        )}

        {/* Model (searchable) */}
        <TextField
          fullWidth
          label="Model"
          name="model"
          value={modelInput}
          onChange={handleChange}
          margin="normal"
          autoComplete="off"
          disabled={!formData.brand}
        />
        {filteredModels.length > 0 && (
          <Paper elevation={3} sx={{ maxHeight: 200, overflowY: "auto" }}>
            <List dense>
              {filteredModels.slice(0, 10).map((m) => (
                <ListItemButton
                  key={m.Model_ID}
                  onClick={() => handleSelectModel(m.Model_Name)}
                >
                  <ListItemText primary={m.Model_Name} />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        )}

        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          margin="normal"
        />

        {/* Year */}
        <TextField
          fullWidth
          select
          label="Year"
          name="year"
          value={formData.year || ""}
          onChange={handleChange}
          margin="normal"
        >
          {generateYearOptions().map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </TextField>

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
          label="Registration Province"
          name="registrationProvince"
          value={formData.registrationProvince || ""}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Current Odometer"
          name="currentOdometer"
          type="number"
          value={formData.currentOdometer || ""}
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

export default VehicleDialog;
