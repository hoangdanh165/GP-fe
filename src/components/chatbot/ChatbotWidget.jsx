import { useState } from "react";
import { IconButton, Box, Paper, Avatar, Typography } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import MessageContainer from "./MessageContainer";
import avatar from "../../assets/chatbot/avatar.png";

const ChatbotWidget = ({ currentUser }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { auth } = useAuth();

  const hiddenPaths = [
    "/sign-in",
    "/sign-up",
    "/unauthorized",
    "/forbidden",
    "/banned",
    "*",
  ];

  const shouldHide = hiddenPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  if (!auth || auth.role !== "customer" || shouldHide) {
    return null;
  }

  return (
    <>
      {!open && (
        <IconButton
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            bgcolor: "white",
            color: "white",
            zIndex: 2000,
          }}
          onClick={() => setOpen(true)}
        >
          <Avatar src={avatar} alt="Chatbot" sx={{ width: 40, height: 40 }} />
        </IconButton>
      )}

      {open && (
        <Paper
          elevation={8}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 320,
            height: 450,
            display: "flex",
            flexDirection: "column",
            borderRadius: 3,
            overflow: "hidden",
            zIndex: 2100,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              bgcolor: "primary.main",
              color: "white",
              p: 1.4,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "left",
            }}
          >
            <Avatar
              src={avatar}
              sx={{ width: 40, height: 40, marginRight: 1 }}
            />
            <Typography>Service Chatbot</Typography>
            <IconButton
              size="small"
              onClick={() => setOpen(false)}
              sx={{ color: "white", alignSelf: "center", ml: "auto" }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              p: 0.1,
              bgcolor: "#f9f9f9",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <MessageContainer />
          </Box>
        </Paper>
      )}
    </>
  );
};

export default ChatbotWidget;
