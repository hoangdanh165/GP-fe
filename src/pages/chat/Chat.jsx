import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  TextField,
  Button,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import "./chat.css";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";
import useSocket from "../../hooks/useSocket";


const conversationsMock = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    lastMessage: "Hello!",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Trần Thị B",
    lastMessage: "Làm bài tập chưa?",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
];

export default function ChatUI() {
  const theme = useTheme();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessages] = useState([]);
  const { messages, sendMessage } = useSocket(selectedConversation?.id);

  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  let typingTimeout = null;

  useEffect(() => {
    if (typing) {
      const timeout = setTimeout(() => setTyping(false), 1500);
      return () => clearTimeout(timeout);
    }
  }, [typing]);

  const handleConversationClick = (conv) => {
    setSelectedConversation(conv);
    const conversationMessages = {
      1: [
        { id: 1, content: "Hello!", sender: "Nguyễn Văn A" },
        { id: 2, content: "Chào bạn!", sender: "me" },
      ],
      2: [
        { id: 1, content: "Làm bài tập chưa?", sender: "Trần Thị B" },
        { id: 2, content: "Chưa, có đề không?", sender: "me" },
      ],
    };
    setMessages(conversationMessages[conv.id] || []);
  };

  const handleSend = () => {
    if (newMessage.trim()) {
        sendMessage(newMessage);
        setNewMessage("");
    }
};


  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    setTyping(true);

    if (typingTimeout) clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => setTyping(false), 1000);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMessages([
        ...messages,
        { id: messages.length + 1, content: `📎 ${file.name}`, sender: "me" },
      ]);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversationsMock.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      display="flex"
      height="80vh"
      width="100vw"
      maxWidth="1200px"
      p={2}
      bgcolor={theme.palette.background.default}
    >
      {/* Sidebar */}
      <Box
        width="30%"
        bgcolor={theme.palette.mode === "dark" ? "#2a2b34" : "#f0f0f0"}
        p={2}
        borderRadius={2}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography variant="h5" color="textPrimary">
            Đoạn Chat
          </Typography>
          <IconButton color="primary">
            <EditIcon />
          </IconButton>
        </Box>
        {/* Search Bar */}
        <Box
          display="flex"
          alignItems="center"
          mb={2}
          bgcolor="inherit"
          borderRadius={2}
          p={1}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        {filteredConversations.map((conv) => (
          <Box
            key={conv.id}
            display="flex"
            alignItems="center"
            p={2}
            mb={1}
            bgcolor={
              selectedConversation?.id === conv.id ? "#3a3b44" : "inherit"
            }
            borderRadius={2}
            sx={{ cursor: "pointer" }}
            onClick={() => handleConversationClick(conv)}
          >
            <Avatar src={conv.avatar} sx={{ mr: 2 }} />
            <Typography color="textPrimary">{conv.name}</Typography>
          </Box>
        ))}
      </Box>

      {/* Chat Window */}
      <Box
        flex={1}
        ml={2}
        display="flex"
        flexDirection="column"
        p={2}
        bgcolor={theme.palette.background.paper}
        borderRadius={2}
      >
        {selectedConversation ? (
          <>
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar src={selectedConversation.avatar} sx={{ mr: 2 }} />
              <Typography variant="h6" color="textPrimary">
                {selectedConversation.name}
              </Typography>
            </Box>
            <Box flex={1} overflow="auto" p={2}>
              {messages.map((msg) => (
                <Box
                  key={msg.id}
                  display="flex"
                  justifyContent={
                    msg.sender === "me" ? "flex-end" : "flex-start"
                  }
                  mb={1}
                >
                  <Box
                    p={1.5}
                    borderRadius={2}
                    bgcolor={
                      msg.sender === "me"
                        ? theme.palette.primary.main
                        : theme.palette.grey[300]
                    }
                    color={msg.sender === "me" ? "white" : "black"}
                    maxWidth="60%"
                  >
                    {msg.content}
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Typing Indicator */}
            {typing && (
              <Box display="flex" justifyContent="flex-end" mt={1} pr={2}>
                <Box
                  p={1.2}
                  borderRadius={2}
                  bgcolor={theme.palette.grey[300]}
                  maxWidth="fit-content"
                  display="flex"
                  alignItems="center"
                >
                  <Typography variant="body2" color="textSecondary">
                    Typing
                  </Typography>
                  <Box display="flex" ml={1}>
                    <Box className="dot" />
                    <Box className="dot" />
                    <Box className="dot" />
                  </Box>
                </Box>
              </Box>
            )}

            <Box display="flex" alignItems="center" mt={2}>
              <IconButton color="primary" component="label">
                <input type="file" hidden onChange={handleFileUpload} />
                <AttachFileIcon />
              </IconButton>
              <TextField
                fullWidth
                sx={{ ml: 2 }}
                variant="outlined"
                placeholder="Nhập tin nhắn..."
                value={newMessage}
                onChange={handleTyping}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && handleSend()
                }
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ ml: 2 }}
                onClick={handleSend}
              >
                Gửi
              </Button>
            </Box>
          </>
        ) : (
          <Typography variant="h6" textAlign="center" color="textSecondary">
            Chọn một cuộc trò chuyện để bắt đầu!
          </Typography>
        )}
      </Box>
    </Box>
  );
}
