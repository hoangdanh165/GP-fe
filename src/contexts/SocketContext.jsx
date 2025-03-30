import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import useAuth from "../hooks/useAuth";

const SocketContext = createContext();
const NODE_JS_HOST = import.meta.env.VITE_NODE_JS_HOST;

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const { auth } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const socket = io(NODE_JS_HOST, {
      query: {
        userId: auth?.userId,
      },
    });

    setSocket(socket);

    socket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => socket && socket.close();
  }, [auth?.userId]);

  console.log(onlineUsers);
  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
