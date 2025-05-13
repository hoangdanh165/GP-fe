import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Chip,
} from "@mui/material";
import { useState } from "react";

const AddServiceDialog = ({ open, onClose, services, onAddServices }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [addedServices, setAddedServices] = useState([]);

  const categories = [...new Set(services.map((s) => s.category.name))];

  const filteredServices = services.filter(
    (s) => s.category.name === selectedCategory
  );

  const handleAddService = () => {
    if (
      selectedService &&
      !addedServices.some((s) => s.id === selectedService.id)
    ) {
      setAddedServices((prev) => [...prev, selectedService]);
    }
  };

  const handleRemoveService = (id) => {
    setAddedServices((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSave = () => {
    console.log(addedServices);
    setSelectedCategory("");
    setSelectedService(null);
    onAddServices(addedServices);
    setAddedServices([]);
    onClose();
  };

  const handleClose = () => {
    setSelectedCategory("");
    setSelectedService(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle align="center">ADD SERVICES</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedService(null);
            }}
            label="Category"
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth disabled={!selectedCategory}>
          <InputLabel>Service</InputLabel>
          <Select
            value={selectedService?.id || ""}
            onChange={(e) => {
              const service = filteredServices.find(
                (s) => s.id === e.target.value
              );
              if (service && !addedServices.some((s) => s.id === service.id)) {
                setAddedServices((prev) => [...prev, service]);
                setSelectedService(service);
              }
            }}
            label="Service"
          >
            {filteredServices.map((service) => (
              <MenuItem key={service.id} value={service.id}>
                {service.name} - {service.price} VND
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box
          display="flex"
          flexWrap="wrap"
          gap={1}
          p={1}
          mt={1}
          border="1px solid"
          borderColor="divider"
          borderRadius={1}
        >
          {addedServices.map((service) => (
            <Chip
              key={service.id}
              label={service.name}
              onDelete={() => handleRemoveService(service.id)}
              color="primary"
            />
          ))}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddServiceDialog;
