import React, { useState, useMemo } from "react";
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
  TextField,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SearchIcon from "@mui/icons-material/Search";
import useAuth from "../../hooks/useAuth";

const NewConversationDialog = ({
  open,
  onClose,
  userList,
  onCreateConversation,
  loading,
}) => {
  const { auth } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

  const filteredUsers = useMemo(() => {
    return userList
      ?.filter((user) =>
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((user) =>
        selectedRole === "all" ? true : user.role === selectedRole
      );
  }, [userList, searchTerm, selectedRole]);

  const roleLabels = {
    admin: "Garage's Owner",
    sale: "Sale",
    customer: "Customer",
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ alignSelf: "center" }}>
        {auth.role === "customer" ? "Contact Our Staffs" : "Contact"}
      </DialogTitle>

      <DialogContent
        sx={{
          height: "500px",
          maxHeight: "600px",
          overflowY: "auto",
        }}
      >
        <Box
          display="flex"
          gap={2}
          mb={2}
          flexDirection={{ xs: "column", sm: "row" }}
        >
          <TextField
            fullWidth
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ marginTop: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            select
            fullWidth
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            label="Filter by Role"
            sx={{ marginTop: 2 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="admin">Garage's Owner</MenuItem>
            <MenuItem value="sale">Sale</MenuItem>
            <MenuItem value="customer">Customer</MenuItem>
          </TextField>
        </Box>

        <Grid container spacing={2} direction="column">
          {filteredUsers?.length > 0 ? (
            filteredUsers.map((staff) => (
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
                      {roleLabels[staff.role] || "Unknown"}
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
              No users found!
            </Typography>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewConversationDialog;
