import React, { useState, useEffect } from "react";
import {
  Popover,
  Badge,
  IconButton,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Button,
  Box,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import useNotification from "../../hooks/useNotification";
import useAuth from "../../hooks/useAuth";
import useShowSnackbar from "../../hooks/useShowSnackbar";
import { useSocket } from "../../contexts/SocketContext";
import messageSound from "../../assets/sounds/message.mp3";

export default function NotificationBell() {
  const { auth } = useAuth();
  const { showSnackbar, CustomSnackbar } = useShowSnackbar();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [selectedTab, setSelectedTab] = useState("all");
  const { socket } = useSocket();

  const {
    notifications,
    setNotifications,
    fetchMoreNotifications,
    loading,
    loadingMore,
    error,
    hasMore,
  } = useNotification();

  useEffect(() => {
    if (error) {
      showSnackbar(error, "error");
    }
  }, [error]);

  useEffect(() => {
    socket.on("newNotification", (notificationData) => {
      setNotifications((prev) => [notificationData, ...prev]);
      showSnackbar("You have a new notification", "info");
      const sound = new Audio(messageSound);
      sound.play();
    });

    return () => {
      socket.off("newNotification");
    };
  }, [socket]);

  const filteredNotifications =
    selectedTab === "unread"
      ? notifications.filter((notification) => !notification.is_read)
      : notifications;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    console.log(notifications);
  }, [notifications]);

  const handleClose = () => {
    setSelectedTab("all");
    setAnchorEl(null);
  };

  const timeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval} years ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} months ago`;

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} days ago`;

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} hours ago`;

    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval} minutes ago`;

    return `${seconds} seconds ago`;
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{ p: 0, minWidth: "30px", minHeight: "30px" }}
        disabled={loading}
      >
        <Badge
          badgeContent={notifications.filter((n) => !n.is_read).length}
          color="error"
        >
          <NotificationsRoundedIcon sx={{ fontSize: 20 }} />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ mt: 1 }}
      >
        <Box m={2}>
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            sx={{ textAlign: "left" }}
          >
            Notifications
          </Typography>
          <Tabs
            value={selectedTab}
            onChange={(e, newVal) => setSelectedTab(newVal)}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
            sx={{ mb: 1 }}
          >
            <Tab label="All" value="all" />
            <Tab label="Unread" value="unread" />
          </Tabs>
        </Box>
        <List sx={{ width: 300, maxHeight: 400, overflowY: "auto" }}>
          {loading ? (
            <ListItem>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              <ListItemText primary="Loading notifications..." />
            </ListItem>
          ) : notifications.length > 0 ? (
            <>
              {filteredNotifications.map((notif) => (
                <ListItem key={notif.id} button onClick={handleClose}>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <ListItemText primary={notif.notification.message} />
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#888",
                        fontSize: "0.75rem",
                        marginTop: 0.5,
                      }}
                    >
                      {timeAgo(notif.create_at)} {/* ví dụ: "5 minutes ago" */}
                    </Typography>
                  </Box>
                </ListItem>
              ))}

              {hasMore && (
                <ListItem sx={{ justifyContent: "center" }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={fetchMoreNotifications}
                    sx={{
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                    fullWidth
                    disabled={loadingMore}
                  >
                    {loadingMore && <CircularProgress size={16} />}
                    {loadingMore ? "Loading..." : "See previous notifications"}
                  </Button>
                </ListItem>
              )}
            </>
          ) : (
            <ListItem>
              <ListItemText primary="No notifications." />
            </ListItem>
          )}
        </List>
      </Popover>
      <CustomSnackbar />
    </>
  );
}
