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

const MessageContainer = () => {
  const theme = useTheme();
  const borderColor = theme.palette.mode === "dark" ? "#333" : "#FFF";

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
          console.log(error.message || "Lỗi không xác định");
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
        bgcolor: "background.default",
        borderRadius: 2,
        p: 2,
        height: "100%",
      }}
      direction="column"
    >
      {/* Message header */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ height: 48 }}
      >
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <Avatar
            src={selectedConversation.userProfilePic}
            sx={{ width: 32, height: 32 }}
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
              sx={{
                p: 1,
                borderRadius: 1,
                alignSelf: i % 2 === 0 ? "flex-start" : "flex-end",
              }}
            >
              {i % 2 === 0 && (
                <Skeleton variant="circular" width={28} height={28} />
              )}
              <Stack spacing={1}>
                <Skeleton variant="rounded" width={250} height={10} />
                <Skeleton variant="rounded" width={250} height={10} />
                <Skeleton variant="rounded" width={250} height={10} />
              </Stack>
              {i % 2 !== 0 && (
                <Skeleton variant="circular" width={28} height={28} />
              )}
            </Stack>
          ))}

        {/* Messages */}
        {!loadingMessages &&
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
    </Stack>
  );
};

export default MessageContainer;
