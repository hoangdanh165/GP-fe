import {
  Avatar,
  Divider,
  Stack,
  Box,
  Skeleton,
  Typography,
  IconButton,
  Badge,
  useTheme,
} from "@mui/material";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { useEffect, useRef, useState } from "react";

import {
  conversationsAtom,
  selectedConversationAtom,
} from "../../atoms/messagesAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useSocket } from "../../contexts/SocketContext";
import messageSound from "../../assets/sounds/message.mp3";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import useShowSnackbar from "../../hooks/useShowSnackbar";

const MessageContainer = () => {
  const theme = useTheme();
  const borderColor = theme.palette.mode === "dark" ? "#333" : "#FFF";
  const { showSnackbar, CustomSnackbar } = useShowSnackbar();

  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const { socket, onlineUsers } = useSocket();
  let isOnline;

  const selectedConversation = useRecoilValue(selectedConversationAtom);

  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messages, setMessages] = useState([]);

  const setConversations = useSetRecoilState(conversationsAtom);
  const messageEndRef = useRef(null);

  isOnline = onlineUsers.includes(selectedConversation.userId);

  useEffect(() => {
    socket.on("newMessage", (message) => {
      if (selectedConversation._id === message.conversation) {
        setMessages((prev) => [...prev, message]);
      }

      if (!document.hasFocus()) {
        const sound = new Audio(messageSound);
        sound.play();
      }

      setConversations((prev) => {
        const updatedConversations = prev.map((conversation) => {
          if (conversation.id === message.conversation) {
            return {
              ...conversation,
              last_message: message.message,
              last_sender: message.sender,
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    });

    return () => socket.off("newMessage");
  }, [socket, selectedConversation, setConversations]);

  useEffect(() => {
    const lastMessageIsFromOtherUser =
      messages.length && messages[messages.length - 1].sender !== auth.userId;
    if (lastMessageIsFromOtherUser) {
      socket.emit("markMessagesAsSeen", {
        conversationId: selectedConversation._id,
        userId: selectedConversation.userId,
      });
    }

    socket.on("messagesSeen", ({ conversationId }) => {
      if (selectedConversation._id === conversationId) {
        setMessages((prev) => {
          const updatedMessages = prev.map((message) => {
            if (!message.seen) {
              return {
                ...message,
                seen: true,
              };
            }
            return message;
          });
          return updatedMessages;
        });
      }
    });
  }, [socket, auth.userId, messages, selectedConversation]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      setMessages([]);
      if (!selectedConversation.firstCreated) {
        setLoadingMessages(true);
        try {
          const res = await axiosPrivate.get(
            `/api/v1/messages/by-conversation/${selectedConversation._id}`
          );

          setMessages(res.data);
        } catch (error) {
          console.log(error.message || "Unidentified error!");
          showSnackbar(error.message, "info");
        } finally {
          setLoadingMessages(false);
        }
      }
    };

    getMessages();
  }, [selectedConversation._id, selectedConversation.firstCreated]);

  return (
    <Stack
      flex={70}
      sx={{
        bgcolor: theme.palette.mode === "dark" ? "#2a2b34" : "#f0f0f0",
        borderRadius: 2,
        pl: 2,
        pr: 2,
        pb: 2,
        height: "100%",
      }}
      direction="column"
    >
      {/* Message header */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ height: 60 }}
      >
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <Avatar
            src={selectedConversation.userProfilePic}
            sx={{ width: 40, height: 40 }}
          />
          {isOnline && (
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: "#00FF00",
                border: `1.5px solid ${borderColor}`,
              }}
            />
          )}
        </Box>

        <Typography variant="body1" fontWeight="bold">
          {selectedConversation.username}
        </Typography>
      </Stack>

      <Divider />

      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        {/* Loading Skeletons */}
        {loadingMessages &&
          [...Array(5)].map((_, i) => (
            <Stack
              key={i}
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="center"
              sx={{
                p: 1,
                borderRadius: 1,
                width: "100%",
                marginBottom: 1,
              }}
            >
              {i % 2 === 0 && (
                <Skeleton variant="circular" width={28} height={28} />
              )}
              <Stack spacing={1} sx={{ width: "100%" }}>
                <Skeleton variant="rounded" width="100%" height={10} />
                <Skeleton variant="rounded" width="100%" height={10} />
                <Skeleton variant="rounded" width="100%" height={10} />
              </Stack>
              {i % 2 !== 0 && (
                <Skeleton variant="circular" width={28} height={28} />
              )}
            </Stack>
          ))}

        {/* Messages */}
        {!loadingMessages && messages.length === 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Typography
              variant="body2"
              color="textSecondary"
              textAlign="center"
              sx={{
                fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" },
                fontWeight: "bold",
              }}
            >
              Text something to start this conversation.
            </Typography>
          </Box>
        )}
        {!loadingMessages &&
          messages.length > 0 &&
          messages.map((message) => (
            <Box
              key={message.id}
              ref={
                messages.length - 1 === messages.indexOf(message)
                  ? messageEndRef
                  : null
              }
            >
              <Message
                message={message}
                ownMessage={auth.userId === message.sender}
              />
            </Box>
          ))}
      </Box>

      <MessageInput setMessages={setMessages} />
      <CustomSnackbar />
    </Stack>
  );
};

export default MessageContainer;
