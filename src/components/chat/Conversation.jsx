import {
  Avatar,
  Badge,
  Box,
  Typography,
  Stack,
  ListItem,
  useTheme,
} from "@mui/material";
import { useRecoilState, useRecoilValue } from "recoil";
import useAuth from "../../hooks/useAuth";
import CheckIcon from "@mui/icons-material/Check";
import ImageIcon from "@mui/icons-material/Image";
import { selectedConversationAtom } from "../../atoms/messagesAtom";

const Conversation = ({ conversation, isOnline }) => {
  const theme = useTheme();
  const { auth } = useAuth();

  const user = conversation.participants.find(
    (participant) => participant.id !== auth.userId
  );

  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );

  console.log("selectedConversation", selectedConversation);

  return (
    <ListItem
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        padding: 1,
        borderRadius: 1,
        cursor: "pointer",
        backgroundColor:
          selectedConversation?._id === conversation._id
            ? theme.palette.action.selected
            : "transparent",
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
        },
      }}
      onClick={() =>
        setSelectedConversation({
          _id: conversation.id,
          userId: user.id,
          userProfilePic: user.avatar,
          username: user.fullName,
          mock: conversation.mock,
        })
      }
    >
      <Box sx={{ position: "relative" }}>
        <Avatar src={user.avatar} sx={{ width: 40, height: 40 }} />
        {isOnline && (
          <Badge
            color="success"
            overlap="circular"
            variant="dot"
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: "green",
              border: "2px solid white",
            }}
          />
        )}
      </Box>

      <Stack direction="column" fontSize="small">
        <Typography fontWeight={700} display="flex" alignItems="center">
          {user.full_name}
        </Typography>
        <Typography
          fontSize="small"
          display="flex"
          alignItems="center"
          gap={1}
          color="text.secondary"
        >
          {auth.userId === conversation.last_sender ? (
            <Box
              color={conversation.last_message_seen ? "blue.400" : "gray.500"}
            >
              <CheckIcon fontSize="small" />
            </Box>
          ) : null}
          {conversation.last_message?.length > 18
            ? conversation.last_message.substring(0, 18) + "..."
            : conversation.last_message || <ImageIcon fontSize="small" />}
        </Typography>
      </Stack>
    </ListItem>
  );
};

export default Conversation;
