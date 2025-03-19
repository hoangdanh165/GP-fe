import React, { useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  ConversationList,
  Conversation,
  ConversationHeader,
  MessageList,
  Message,
  MessageInput,
  Avatar,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { Box, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const conversationsMock = [
  { id: 1, name: "Nguyễn Văn A", lastMessage: "Hello!", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Trần Thị B", lastMessage: "Làm bài tập chưa?", avatar: "https://i.pravatar.cc/150?img=2" },
];

export default function ChatUI() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);

  const handleConversationClick = (conv) => {
    setSelectedConversation(conv);
    console.log(selectedConversation);
    // Load tin nhắn tương ứng với cuộc trò chuyện
    const conversationMessages = {
      1: [
        { id: 1, content: "Hello!", sent_at: "10:00", sender: "customer" },
        { id: 2, content: "Chào bạn!", sent_at: "10:01", sender: "coach" },
      ],
      2: [
        { id: 1, content: "Làm bài tập chưa?", sent_at: "11:00", sender: "customer" },
        { id: 2, content: "Chưa, có đề không?", sent_at: "11:05", sender: "coach" },
      ],
    };
  
    setMessages(conversationMessages[conv.id] || []);
  };
  

  const handleSend = (text) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: prevMessages.length + 1, content: text, sender: "customer" },
    ]);
    setTyping(true);
    setTimeout(() => setTyping(false), 1000);
  };
  

  return (
    <Box display="flex" height="80vh" width="100vw" maxWidth="1800px" bgcolor="inherit" p={2}>
      {/* Sidebar */}
      <Box width={"30%"} bgcolor="#2a2b34" p={2} borderRadius={2}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h5" color="white">Đoạn Chat</Typography>
          <IconButton color="primary">
            <EditIcon />
          </IconButton>
        </Box>
        <ConversationList>
          {conversationsMock.map((conv) => (
            <Conversation
              key={conv.id}
              name={conv.name}
              info={conv.lastMessage}
              onClick={() => handleConversationClick(conv)}
              style={{ backgroundColor: selectedConversation?.id === conv.id ? "#3a3b44" : "#2a2b34", color: "black" }}
            >
              <Avatar src={conv.avatar} name={conv.name} />
            </Conversation>
          ))}
        </ConversationList>
      </Box>

      {/* Chat Container */}
      <Box flex={1} ml={2}>
        <MainContainer style={{ borderRadius: 10, overflow: "hidden" }}>
          <ChatContainer>
            {selectedConversation ? (
              <>
                <ConversationHeader>
                  <Avatar src={selectedConversation.avatar} name={selectedConversation.name} />
                  <ConversationHeader.Content userName={selectedConversation.name} info="Online" />
                </ConversationHeader>
                <MessageList typingIndicator={typing ? <TypingIndicator content="Đang nhập..." /> : null}>
                  {messages.map((msg) => (
                    <Message
                      key={msg.id}
                      model={{
                        message: msg.content,
                        direction: msg.sender === "coach" ? "outgoing" : "incoming",
                      }}
                    />
                  ))}
                </MessageList>
                <MessageInput placeholder="Nhập tin nhắn..." onSend={handleSend} />
              </>
            ) : (
              <Box textAlign="center" p={5} backgroundColor="black" color="black">Chọn một cuộc trò chuyện để bắt đầu!</Box>
            )}
          </ChatContainer>
        </MainContainer>
      </Box>
    </Box>
  );
}
