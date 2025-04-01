import { Avatar, Box, Typography, Skeleton, IconButton } from "@mui/material";
import { useRecoilValue } from "recoil";
import { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { selectedConversationAtom } from "../../atoms/messagesAtom";
import useAuth from "./../../hooks/useAuth";

const Message = ({ ownMessage, message }) => {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const { auth } = useAuth();
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <Box
      display="flex"
      gap={1}
      alignSelf={ownMessage ? "flex-end" : "flex-start"}
      flexDirection={ownMessage ? "row-reverse" : "row"}
    >
      {/* Avatar */}
      <Avatar
        src={ownMessage ? auth.avatar : selectedConversation.userProfilePic}
        sx={{ width: 32, height: 32 }}
      />

      {/* Text Message */}
      {message.message && (
        <Box
          sx={{
            backgroundColor: ownMessage ? "green" : "lightgray",
            color: ownMessage ? "white" : "black",
            padding: "8px",
            borderRadius: "8px",
            maxWidth: "350px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography>{message.message}</Typography>
          {ownMessage && (
            <IconButton
              sx={{
                marginLeft: 1,
                color: message.seen === true ? "blue" : "inherit",
              }}
            >
              {message.seen === true ? <DoneAllIcon /> : <CheckIcon />}
            </IconButton>
          )}
        </Box>
      )}

      {/* Image Message */}
      {message.img && (
        <Box sx={{ position: "relative", width: 200, marginTop: 1 }}>
          {!imgLoaded && (
            <Skeleton variant="rectangular" width={200} height={200} />
          )}
          <img
            src={message.img}
            alt="Message"
            style={{
              width: "200px",
              borderRadius: "4px",
              display: imgLoaded ? "block" : "none",
            }}
            onLoad={() => setImgLoaded(true)}
          />
          {ownMessage && imgLoaded && (
            <IconButton
              sx={{
                position: "absolute",
                bottom: 5,
                right: 5,
                color: message.seen ? "blue" : "inherit",
              }}
            >
              {message.seen ? <DoneAllIcon /> : <CheckIcon />}
            </IconButton>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Message;
