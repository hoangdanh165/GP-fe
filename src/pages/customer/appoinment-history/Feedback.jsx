import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Rating,
  Button,
} from "@mui/material";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useShowSnackbar from "../../../hooks/useShowSnackbar";

const Feedback = ({
  open,
  onClose,
  appointmentId = null,
  feedbackData = null,
  onSuccess,
  editMode = false,
}) => {
  const [rating, setRating] = useState(feedbackData?.rating || 0);
  const [comment, setComment] = useState(feedbackData?.comment || "");
  const [loading, setLoading] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const { showSnackbar, CustomSnackbar } = useShowSnackbar();

  useEffect(() => {
    setRating(feedbackData?.rating || 0);
    setComment(feedbackData?.comment || "");
  }, [feedbackData]);

  const handleSubmit = async () => {
    if (!appointmentId || rating === 0) {
      showSnackbar("Please provide rating and appointment ID", "error");
      return;
    }

    try {
      setLoading(true);
      await axiosPrivate.post("/api/v1/feedbacks/create-for-appointment/", {
        appointment_id: appointmentId,
        rating,
        comment,
      });
      showSnackbar("Feedback submitted successfully!", "success");
      setRating(0);
      setComment("");
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      showSnackbar(
        err.response?.data?.detail || "Failed to submit feedback",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setComment("");
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle alignSelf={"center"}>Leave Your Feedback</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <Typography>Your Rating</Typography>
            <Rating
              name="appointment-rating"
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
            />

            <TextField
              label="Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} color="error" disabled={editMode}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="secondary"
            disabled={loading | editMode}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
      <CustomSnackbar />
    </>
  );
};

export default Feedback;
