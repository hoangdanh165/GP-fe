import { Avatar, Box, Typography, Skeleton, IconButton } from "@mui/material";
import { useRecoilValue } from "recoil";
import { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { selectedConversationAtom } from "../../atoms/messagesAtom";
import { BsCheck2All } from "react-icons/bs";
import { Dialog } from "@mui/material";

import useAuth from "./../../hooks/useAuth";

const Message = ({ ownMessage, message, isLastMessage }) => {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const { auth } = useAuth();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogImage, setDialogImage] = useState("");

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
          src={selectedConversation.userProfilePic}
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
              maxWidth: "350px",
              display: "flex",
              alignItems: "center",
              mb: 0.1,
              mt: 0.1,
              wordWrap: "break-word",
            }}
          >
            <Typography
              sx={{
                maxWidth: "100%",
                wordBreak: "break-word",
              }}
            >
              {message.message}
            </Typography>
          </Box>
          {ownMessage && isLastMessage && (
            <Box
              sx={{
                alignSelf: "flex-end",
                mt: 0.5,
                mr: 0,
                color: message.seen ? "blue" : "",
                fontWeight: "bold",
              }}
            >
              <BsCheck2All size={16} />
            </Box>
          )}
        </Box>
      )}

      {/* Image Message */}
      {message.image && (
        <Box sx={{ position: "relative", width: 200, marginTop: 1 }}>
          {!imgLoaded && (
            <Skeleton variant="rectangular" width={200} height={200} />
          )}
          <img
            src={message.image}
            alt="Message"
            style={{
              width: "200px",
              borderRadius: "4px",
              display: imgLoaded ? "block" : "none",
            }}
            onLoad={() => setImgLoaded(true)}
            onClick={() => {
              setDialogImage(message.image);
              setOpenDialog(true);
            }}
          />
          {ownMessage && imgLoaded && (
            <Box
              sx={{
                alignSelf: "flex-end",
                mt: 0.5,
                mr: 0,
                color: message.seen ? "blue" : "",
                fontWeight: "bold",
              }}
            >
              <BsCheck2All size={16} />
            </Box>
          )}
        </Box>
      )}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="lg"
      >
        <img
          src={dialogImage}
          alt="Full-size"
          style={{
            maxWidth: "90vw",
            maxHeight: "90vh",
          }}
        />
      </Dialog>
    </Box>
  );
};

export default Message;
