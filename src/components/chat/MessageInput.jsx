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

const NODE_JS_HOST = import.meta.env.VITE_NODE_JS_HOST;

const MessageInput = ({ setMessages }) => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
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
      const res = await fetch(`${NODE_JS_HOST}/api/v1/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: auth.userId,
          message: messageText,
          receiver: selectedConversation?.userId, // Check tránh lỗi undefined
          conversation: selectedConversation?._id, // Check tránh lỗi undefined
        }),
      });

      if (!res.ok)
        throw new Error(`Lỗi server: ${res.status} ${res.statusText}`);

      const data = await res.json();
      console.log("✅ Tin nhắn gửi thành công:", data);

      // Cập nhật danh sách tin nhắn
      setMessages((prevMessages) => [...prevMessages, data]);

      // Cập nhật cuộc hội thoại
      setConversations((prevConvs) => {
        console.log("🚀 Trước khi cập nhật:", prevConvs);
        const updatedConversations = prevConvs.map((conversation) => {
          if (conversation.id === selectedConversation._id) {
            return {
              ...conversation,
              last_message: data.message,
              last_sender: data.sender_id,
            };
          }
          return conversation;
        });
        return updatedConversations;
      });

      // Reset input sau khi gửi thành công
      setMessageText("");
      setImgUrl("");
    } catch (error) {
      console.error("❌ Lỗi khi gửi tin nhắn:", error.message);
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
