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
import { useRecoilState } from "recoil";
import { chatbotHistoryAtom } from "../../atoms/chatbotHistoryAtom";
import messageSound from "../../assets/sounds/message.mp3";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import useShowSnackbar from "../../hooks/useShowSnackbar";
import { v4 as uuidv4 } from "uuid";

const MessageContainer = () => {
  const theme = useTheme();
  const { showSnackbar, CustomSnackbar } = useShowSnackbar();

  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

  const [botIsThinking, setBotIsThinking] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messages, setMessages] = useRecoilState(chatbotHistoryAtom);

  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      setMessages([]);

      setLoadingMessages(true);
      try {
        const res = await axiosPrivate.get(`/api/v1/chatbot/history/`);
        if (res.data.length === 0) {
          setMessages([
            {
              id: uuidv4(),
              message:
                "Hello there, welcome to Prestige Auto Garage! How can I assist you today?",
              is_bot: true,
            },
          ]);
        } else {
          setMessages(res.data);
        }
      } catch (error) {
        console.log(error.message || "Unidentified error!");
        showSnackbar(error.message, "error");
      } finally {
        setLoadingMessages(false);
      }
    };

    getMessages();
  }, []);

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
      <Box sx={{ flex: 1, overflowY: "auto", pb: 2, pt: 2 }}>
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
                ownMessage={!message.is_bot}
                isLastMessage={index === messages.length - 1}
              />
            </Box>
          ))}
        {botIsThinking && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontStyle: "italic", textAlign: "center", mb: 1 }}
          >
            Chatbot is thinking...
          </Typography>
        )}
      </Box>
      <Box sx={{ mt: 1 }}>
        <MessageInput
          setMessages={setMessages}
          setBotIsThinking={setBotIsThinking}
        />
      </Box>
      <CustomSnackbar />
    </Stack>
  );
};

export default MessageContainer;
