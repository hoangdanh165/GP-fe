import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";

import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  useTheme,
  Skeleton,
  Stack,
  Avatar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import "./chat.css";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";
import Message from "../../components/chat/Message";
import Conversation from "../../components/chat/Conversation";
import MessageContainer from "../../components/chat/MessageContainer";
import MessageInput from "../../components/chat/MessageInput";

import { selectedConversationAtom } from "../../atoms/messagesAtom";
import useSocket from "../../hooks/useSocket";
import useAxiosPrivate from "./../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";

const CONVERSATION_API = "/api/v1/conversations";
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
  const { auth } = useAuth();
  const axios = useAxiosPrivate();

  const [loadingConversations, setLoadingConversations] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
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

  useEffect(() => {
    try {
      const getConversations = async () => {
        const response = await axios.get(CONVERSATION_API);
        setConversations(response.data);
        console.log("Conversations:", response.data);
        setConversations(response.data);
      };
      getConversations();
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoadingConversations(false);
    }
  }, [setConversations]);

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

  const filteredConversations = conversations.filter((conv) => {
    const otherParticipants = conv.participants.filter(
      (p) => p.id !== auth.userId
    );

    return otherParticipants.some((p) =>
      p.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

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

        {/* Conversations List */}
        {filteredConversations.map((conv) => (
          <Conversation
            key={conv.id}
            conversation={conv}
            isSelected={selectedConversation?.id === conv.id}
            onClick={() => handleConversationClick(conv)}
          />
        ))}

        {loadingConversations &&
          [0, 1, 2, 3, 4].map((_, i) => (
            <Stack
              key={i}
              direction="row"
              alignItems="center"
              spacing={2}
              p={1}
              borderRadius={2}
            >
              <Skeleton variant="circular">
                <Avatar sx={{ width: 40, height: 40 }} />
              </Skeleton>
              <Stack spacing={1} width="100%">
                <Skeleton variant="text" width={80} height={10} />
                <Skeleton variant="text" width="90%" height={8} />
              </Stack>
            </Stack>
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
        {selectedConversation._id && <MessageContainer />}
      </Box>
    </Box>
  );
}
