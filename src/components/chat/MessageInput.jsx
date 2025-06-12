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

import {
  conversationsAtom,
  selectedConversationAtom,
} from "../../atoms/messagesAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import ImageIcon from "@mui/icons-material/Image";
import usePreviewImg from "../../hooks/usePreviewImg";
import { useRef, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import useShowSnackbar from "../../hooks/useShowSnackbar";

const NODE_JS_HOST = import.meta.env.VITE_NODE_JS_HOST;

const MessageInput = ({ setMessages }) => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const { showSnackbar, CustomSnackbar } = useShowSnackbar();

  const [messageText, setMessageText] = useState("");
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setConversations = useSetRecoilState(conversationsAtom);
  const imageRef = useRef(null);
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const [isSending, setIsSending] = useState(false);

  const uploadMessageImage = async () => {
    const file = imageRef.current?.files?.[0];

    if (!file) {
      console.error("No image file provided");
      return;
    }
    const formData = new FormData();
    formData.append("image", file);

    const res = await axiosPrivate.post(
      `/api/v1/messages/upload-image/`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return res.data;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageText && !imgUrl) return;
    if (isSending) return;

    setIsSending(true);

    try {
      let image_url = "";
      let image_path = "";

      if (imageRef.current?.files?.[0]) {
        const imageRes = await uploadMessageImage();
        if (!imageRes?.image_url) {
          throw new Error("Failed to upload image");
        }
        image_url = imageRes.image_url;

        const urlParts = image_url.split("/");
        const filename = urlParts[urlParts.length - 1];

        image_path = `media/message_images/${filename}`;
      }

      const res = await fetch(`${NODE_JS_HOST}/api/v1/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: auth.userId,
          message: messageText,
          receiver: selectedConversation?.userId,
          conversation: selectedConversation?._id,
          image_path: image_path,
          image_url: image_url,
        }),
      });

      if (!res.ok)
        throw new Error(`Server error: ${res.status} ${res.statusText}`);

      const data = await res.json();

      setMessages((prevMessages) => [...prevMessages, data]);

      setConversations((prevConvs) => {
        const updatedConversations = prevConvs.map((conversation) => {
          if (conversation.id === selectedConversation._id) {
            return {
              ...conversation,
              last_message: data.image ? "[Image]" : data.message,
              last_sender: data.sender,
            };
          }
          return conversation;
        });
        return updatedConversations;
      });

      setMessageText("");
      setImgUrl("");
      if (imageRef.current) imageRef.current.value = "";
    } catch (error) {
      console.error("Error sending message: ", error.message);
      showSnackbar(error.message, "error");
    } finally {
      setIsSending(false);
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

      {messageText.length > 0 ? (
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
      ) : (
        <>
          <IconButton
            onClick={() => imageRef.current.click()}
            sx={{
              border: "none",
              outline: "none",
              bgcolor: "transparent",
              "&:hover": { bgcolor: "transparent" },
            }}
          >
            <ImageIcon />
          </IconButton>
          <input
            type="file"
            hidden
            ref={imageRef}
            onChange={handleImageChange}
          />
        </>
      )}

      {/* Dialog preview ảnh */}
      <Dialog
        open={Boolean(imgUrl)}
        onClose={() => setImgUrl("")}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Preview Image</DialogTitle>
        <DialogContent>
          <Box
            component="img"
            src={imgUrl}
            sx={{ width: "100%", borderRadius: 1 }}
          />
        </DialogContent>
        <DialogActions>
          {!isSending ? (
            <IconButton onClick={handleSendMessage}>
              <SendIcon />
            </IconButton>
          ) : (
            <CircularProgress size={24} />
          )}
        </DialogActions>
      </Dialog>

      <CustomSnackbar />
    </Stack>
  );
};

export default MessageInput;
