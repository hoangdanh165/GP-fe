import { Outlet } from "react-router-dom";
import DynamicTitle from "./components/utils/DynamicTitle";
import ChatbotWidget from "./components/chatbot/ChatbotWidget";

const App = () => {
  return (
    <>
      <DynamicTitle />
      <Outlet />
      <ChatbotWidget />
    </>
  );
};

export default App;
