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
  CircularProgress,
} from "@mui/material";
import NewConversationDialog from "../../components/chat/NewConversation";
import EditIcon from "@mui/icons-material/Edit";
import "./chat.css";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";
import Conversation from "../../components/chat/Conversation";
import MessageContainer from "../../components/chat/MessageContainer";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

import {
  selectedConversationAtom,
  conversationsAtom,
} from "../../atoms/messagesAtom";
import { useSocket } from "../../contexts/SocketContext";
import useAxiosPrivate from "./../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import useShowSnackbar from "../../hooks/useShowSnackbar";

const NODE_JS_HOST = import.meta.env.VITE_NODE_JS_HOST;
const CONVERSATION_API = "/api/v1/conversations/";
const CREATE_CONVERSATION_API = "/api/v1/conversations/";
const STAFFS_LIST_API = "/api/v1/users/get-staff/";
const ALL_USERS_LIST_API = "/api/v1/users/get-all-users/";
let USER_LIST_API = null;

export default function ChatUI() {
  const theme = useTheme();
  const { auth } = useAuth();
  const axios = useAxiosPrivate();
  const { socket, onlineUsers } = useSocket();
  const { showSnackbar, CustomSnackbar } = useShowSnackbar();

  const [loadingConversations, setLoadingConversations] = useState(true);
  const [newConversationDialog, setNewConversationDialog] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );

  const handleCreateConversation = async (staffId) => {
    setLoading(true);
    try {
      const res = await fetch(`${NODE_JS_HOST}/api/v1/conversations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationStarter: auth.userId,
          conversationReceiver: staffId,
        }),
      });

      if (!res.ok)
        throw new Error(`Server error: ${res.status} ${res.statusText}`);

      const data = await res.json();

      setConversations((prev) => [...prev, data]);

      const opponent = data.participants.find((p) => p.id !== auth.userId);

      setSelectedConversation({
        _id: data.id,
        userId: opponent?.id || "",
        userProfilePic: opponent?.avatar || "",
        username: opponent?.full_name || "",
        firstCreated: true,
      });

      setNewConversationDialog(false);
      setUsers([]);
    } catch (error) {
      console.log(error);
      showSnackbar("Error creating conversation", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleNewConversation = async () => {
    USER_LIST_API =
      auth.role === "customer" ? STAFFS_LIST_API : ALL_USERS_LIST_API;

    if (users.length === 0) {
      try {
        setLoading(true);
        const response = await axios.get(USER_LIST_API);
        setUsers(response.data);
        setNewConversationDialog(true);
      } catch (error) {
        console.error(error);
        showSnackbar("Error fetching users!", "error");
      } finally {
        setLoading(false);
      }
    } else {
      setNewConversationDialog(true);
    }
  };

  useEffect(() => {
    try {
      const getConversations = async () => {
        const response = await axios.get(CONVERSATION_API);
        setConversations(response.data);
      };
      getConversations();
    } catch (error) {
      console.error("Error fetching conversations:", error);
      showSnackbar("Error fetching conversations!", "error");
    } finally {
      setLoadingConversations(false);
    }
  }, [setConversations]);

  useEffect(() => {
    socket.on("newConversation", (conversationData) => {
      if (conversationData) {
        setConversations((prev) => [...prev, conversationData]);
        showSnackbar("You have a new message", "info");
      }
    });

    return () => {
      socket.off("newConversation");
    };
  }, [socket]);

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
            Messages
          </Typography>
          <Box display="flex" alignItems="center">
            {loading ? (
              <CircularProgress size={40} color="primary" />
            ) : (
              <IconButton
                color="primary"
                onClick={() => handleNewConversation()}
              >
                <EditIcon />
              </IconButton>
            )}
          </Box>
        </Box>
        {/* Search Bar */}
        <Box
          display="flex"
          alignItems="center"
          mb={2}
          bgcolor="inherit"
          borderRadius={2}
          // p={1}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for a conversation..."
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
        {/* Skeleton when loading */}
        {loadingConversations &&
          [...Array(5)].map((_, i) => (
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

        {!loadingConversations && filteredConversations.length === 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "70%",
            }}
          >
            <Typography
              variant="body2"
              color="textSecondary"
              textAlign="center"
              sx={{
                fontSize: { xs: "0.5rem", sm: "1rem", md: "1.2rem" },
                fontWeight: "bold",
              }}
            >
              No conversations yet.
            </Typography>
          </Box>
        )}

        {/* Conversations List */}
        {!loadingConversations &&
          filteredConversations.map((conv) => {
            const otherParticipant =
              conv?.participants?.find((p) => p.id !== auth?.userId) || null;

            console.log("other", otherParticipant);

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
      <NewConversationDialog
        open={newConversationDialog}
        onClose={() => setNewConversationDialog(false)}
        userList={users}
        onCreateConversation={handleCreateConversation}
        loading={loading}
      />
      <CustomSnackbar />
    </Box>
  );
}
