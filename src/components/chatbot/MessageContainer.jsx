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
        bgcolor: theme.palette.mode === "dark" ? "#2a2b34" : "#fcfcfcs",
        borderRadius: 2,
        pl: 2,
        pr: 2,
        pb: 2,
        height: "100%",
      }}
      direction="column"
    >
      <Box sx={{ flex: 1, overflowY: "auto", pb: 2, pr: 0.5, pl: 0.5, pt: 2 }}>
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
              {i % 2 === 0 && (
                <Stack spacing={1} sx={{ width: "100%" }}>
                  <Skeleton variant="rounded" width="50%" height={15} />
                  <Skeleton variant="rounded" width="70%" height={15} />
                  <Skeleton variant="rounded" width="60%" height={15} />
                </Stack>
              )}
              {i % 2 !== 0 && (
                <Stack
                  spacing={1}
                  sx={{ width: "100%" }}
                  alignItems={"flex-end"}
                >
                  <Skeleton variant="rounded" width="70%" height={15} />
                  <Skeleton variant="rounded" width="60%" height={15} />
                  <Skeleton variant="rounded" width="40%" height={15} />
                </Stack>
              )}

              {i % 2 !== 0 && (
                <Skeleton variant="circular" width={28} height={28} />
              )}
            </Stack>
          ))}

        {/* Messages */}

        {!loadingMessages &&
          messages.length > 0 &&
          messages.map((message, index) => (
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
                isLastMessage={index === messages.length - 1}
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
