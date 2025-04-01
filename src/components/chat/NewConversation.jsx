import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Avatar,
  Typography,
  Paper,
  IconButton,
  Box,
  CircularProgress,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

const NewConversationDialog = ({
  open,
  onClose,
  staffList,
  onCreateConversation,
  loading,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ alignSelf: "center" }}>Contact Our Staffs</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} direction="column">
          {staffList?.length > 0 ? (
            staffList.map((staff) => (
              <Grid item xs={12} key={staff.id}>
                <Paper
                  elevation={3}
                  sx={{ padding: 2, display: "flex", alignItems: "center" }}
                >
                  <Avatar src={staff.avatar} sx={{ marginRight: 2 }} />
                  <div style={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1">
                      {staff.full_name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {staff.email}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {staff.role === "admin" ? "Garage's Owner" : "Sale"}
                    </Typography>
                  </div>
                  {!staff.had_conversation && (
                    <Box display="flex" alignItems="center">
                      {loading ? (
                        <CircularProgress size={24} color="primary" />
                      ) : (
                        <IconButton
                          color="primary"
                          onClick={() => onCreateConversation(staff.id)}
                        >
                          <ChatBubbleOutlineIcon />
                        </IconButton>
                      )}
                    </Box>
                  )}
                </Paper>
              </Grid>
            ))
          ) : (
            <Typography variant="body1" textAlign="center">
              There are no staffs to chat!
            </Typography>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewConversationDialog;
