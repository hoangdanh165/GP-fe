import { Avatar, Box } from "@mui/material";
import { marked } from "marked";
import DOMPurify from "dompurify";
import chatbotAvatar from "../../assets/chatbot/avatar.png";

const Message = ({ ownMessage, message }) => {
  const createMarkup = (text) => {
    const rawMarkup = marked(text || "", { breaks: true });
    return { __html: DOMPurify.sanitize(rawMarkup) };
  };

  return (
    <Box
      display="flex"
      gap={1}
      alignSelf={ownMessage ? "flex-end" : "flex-start"}
      flexDirection={ownMessage ? "row-reverse" : "row"}
    >
      {/* Avatar */}
      {!ownMessage && (
        <Avatar
          src={chatbotAvatar}
          sx={{ width: 35, height: 35, alignSelf: "center" }}
        />
      )}

      {/* Text Message */}
      {message.message && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: ownMessage ? "flex-end" : "flex-start",
          }}
        >
          <Box
            sx={{
              backgroundColor: ownMessage ? "lightgray" : "#5C5F62",
              color: ownMessage ? "black" : "white",
              padding: "7px",
              borderRadius: "10px",
              maxWidth: "180px",
              display: "flex",
              alignItems: "center",
              mb: 0.5,
              mt: 0.5,
              wordWrap: "break-word",
              fontSize: "0.8rem",
              lineHeight: 1.4,
            }}
          >
            <div
              dangerouslySetInnerHTML={createMarkup(message.message)}
              style={{ wordBreak: "break-word" }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Message;
