import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
// Kết nối tới server socket.io
const socket = io(SOCKET_URL, {
    transports: ["websocket"],
    reconnection: true,
});

const useSocket = (roomId) => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (!roomId) return;

        socket.emit("join_room", roomId);

        socket.on("receive_message", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => {
            socket.emit("leave_room", roomId);
            socket.off("receive_message");
        };
    }, [roomId]);

    const sendMessage = (message) => {
        if (message.trim() !== "") {
            socket.emit("send_message", { roomId, message });
        }
    };

    return { messages, sendMessage };
};

export default useSocket;
