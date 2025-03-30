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
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

import {
  selectedConversationAtom,
  conversationsAtom,
} from "../../atoms/messagesAtom";
import { useSocket } from "../../contexts/SocketContext";
import useAxiosPrivate from "./../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";

const CONVERSATION_API = import.meta.env.VITE_GET_CONVERSATION_API;

export default function ChatUI() {
  const theme = useTheme();
  const { auth } = useAuth();
  const axios = useAxiosPrivate();

  const [loadingConversations, setLoadingConversations] = useState(true);

  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );

  const { socket, onlineUsers } = useSocket();

  useEffect(() => {
    try {
      const getConversations = async () => {
        const response = await axios.get(CONVERSATION_API);
        setConversations(response.data);
        console.log("Conversations:", response.data);
      };
      getConversations();
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoadingConversations(false);
    }
  }, [setConversations]);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((conv) => {
    const otherParticipants = conv.participants.filter(
      (p) => p.id !== auth.userId
    );

    return otherParticipants.some((p) =>
      p.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  useEffect(() => {
    console.log(filteredConversations);
  }, [filteredConversations]);

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
            Messages
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

        {/* Conversations List */}
        {!loadingConversations &&
          filteredConversations.map((conv) => {
            // Lọc ra người còn lại trong cuộc trò chuyện (không phải user hiện tại)
            const otherParticipant =
              conv?.participants?.find((p) => p.id !== auth?.userId) || null;

            console.log("other", otherParticipant);

            // Kiểm tra xem người kia có online không
            const isOnline =
              Array.isArray(onlineUsers) && otherParticipant
                ? onlineUsers.includes(otherParticipant.id)
                : false;

            return (
              <Conversation
                key={conv.id}
                conversation={conv}
                isOnline={isOnline}
              />
            );
          })}
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
        {selectedConversation && selectedConversation._id ? (
          <MessageContainer />
        ) : (
          <Box
            flex={1}
            ml={2}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            p={2}
            bgcolor={theme.palette.background.paper}
            borderRadius={2}
          >
            <ChatBubbleOutlineIcon
              sx={{ fontSize: 50, color: "gray", mb: 1 }}
            />
            <Typography variant="h6" textAlign="center" color="textSecondary">
              Select a conversation to start messaging!
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
