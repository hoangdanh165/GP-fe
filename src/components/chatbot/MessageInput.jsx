import {
  Stack,
  Box,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useRef, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import useShowSnackbar from "../../hooks/useShowSnackbar";
import { v4 as uuidv4 } from "uuid";

const MessageInput = ({ setMessages, setBotIsThinking }) => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const { showSnackbar, CustomSnackbar } = useShowSnackbar();

  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageText.trim() && !imgUrl) return;
    if (isSending) return;

    if (messageText.length > 500) {
      showSnackbar("Message is too long!", "error");
      return;
    }
    const userMessage = {
      id: uuidv4(),
      message: messageText,
      is_bot: false,
    };
    setIsSending(true);
    setBotIsThinking(true);

    setMessageText("");
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const res = await axiosPrivate.post("/api/v1/chatbot/ask/", {
        id: uuidv4(),
        message: messageText,
        user: auth.userId,
        is_bot: false,
      });

      setMessages((prevMessages) => [...prevMessages, res.data]);
    } catch (error) {
      console.error("Error sending message: ", error.message);
      showSnackbar(error.message, "error");
    } finally {
      setIsSending(false);
      setBotIsThinking(false);
    }
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{ width: "100%" }}
    >
      <Box component="form" onSubmit={handleSendMessage} sx={{ flex: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          disabled={isSending}
          placeholder="Type a message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
              paddingRight: "12px",
            },
          }}
        />
      </Box>

      <IconButton
        onClick={handleSendMessage}
        disabled={isSending}
        sx={{
          border: "none",
          outline: "none",
          bgcolor: "transparent",
          "&:hover": { bgcolor: "transparent" },
        }}
      >
        <SendIcon />
      </IconButton>

      <CustomSnackbar />
    </Stack>
  );
};

export default MessageInput;
