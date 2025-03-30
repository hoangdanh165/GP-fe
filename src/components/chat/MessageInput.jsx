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

const MessageInput = ({ setMessages }) => {
  const [messageText, setMessageText] = useState("");
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setConversations = useSetRecoilState(conversationsAtom);
  const imageRef = useRef(null);
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText && !imgUrl) return;
    if (isSending) return;

    setIsSending(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          recipientId: selectedConversation.userId,
          img: imgUrl,
        }),
      });
      const data = await res.json();
      if (data.error) {
        console.log(data.error);
        return;
      }
      console.log(data);
      setMessages((messages) => [...messages, data]);

      setConversations((prevConvs) => {
        const updatedConversations = prevConvs.map((conversation) => {
          if (conversation._id === selectedConversation._id) {
            return {
              ...conversation,
              lastMessage: {
                text: messageText,
                sender: data.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
      setMessageText("");
      setImgUrl("");
    } catch (error) {
      console.log(error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      {/* Input Nhập Tin Nhắn */}
      <Box component="form" onSubmit={handleSendMessage} sx={{ flex: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton onClick={handleSendMessage} disabled={isSending}>
                <SendIcon />
              </IconButton>
            ),
          }}
        />
      </Box>

      {/* Upload Ảnh */}
      <IconButton onClick={() => imageRef.current.click()} size="large">
        <ImageIcon />
      </IconButton>
      <input type="file" hidden ref={imageRef} onChange={handleImageChange} />

      {/* Dialog Hiển Thị Ảnh Preview */}
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
    </Stack>
  );
};

export default MessageInput;
