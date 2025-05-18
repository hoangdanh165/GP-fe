import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const PaymentMethodDialog = ({ open, onClose, onConfirm }) => {
  const [method, setMethod] = useState("");

  const handleConfirm = () => {
    onConfirm(method);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select Payment Method</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Payment Method</InputLabel>
          <Select
            value={method}
            label="Payment Method"
            onChange={(e) => setMethod(e.target.value)}
          >
            <MenuItem value="vn_pay">VNPay</MenuItem>
            <MenuItem value="cash">Cash</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm} variant="contained" disabled={!method}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentMethodDialog;
