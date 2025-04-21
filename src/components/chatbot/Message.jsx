import { Avatar, Box, Typography, Skeleton, IconButton } from "@mui/material";
import { useState } from "react";
import chatbotAvatar from "../../assets/chatbot/avatar.png";

const Message = ({ ownMessage, message }) => {
  return (
    <Box
      display="flex"
      gap={1}
      alignSelf={ownMessage ? "flex-end" : "flex-start"}
      flexDirection={ownMessage ? "row-reverse" : "row"}
    >
      {/* Avatar */}
      {!ownMessage && (
        <Avatar
          src={chatbotAvatar}
          sx={{ width: 35, height: 35, alignSelf: "center" }}
        />
      )}

      {/* Text Message */}
      {message.message && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: ownMessage ? "flex-end" : "flex-start",
          }}
        >
          <Box
            sx={{
              backgroundColor: ownMessage ? "lightgray" : "#5C5F62",
              color: ownMessage ? "black" : "white",
              padding: "7px",
              borderRadius: "10px",
              maxWidth: "180px",
              display: "flex",
              alignItems: "center",
              mb: 0.5,
              mt: 0.5,
              wordWrap: "break-word",
            }}
          >
            <Typography
              sx={{
                maxWidth: "100%",
                wordBreak: "break-word",
                fontSize: "0.8rem",
              }}
            >
              {message.message}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Message;
