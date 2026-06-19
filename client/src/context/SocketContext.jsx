/* eslint-disable react-refresh/only-export-components */
/**
 * FILE PURPOSE
 * ----------------------------
 * Manages the Socket.IO client connection.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Connect when a user logs in, expose socket instance, and track online users.
 *
 * USED BY
 * ----------------------------
 * Chat.jsx and UI components that need real-time presence.
 *
 * REQUEST FLOW
 * ----------------------------
 * Auth user available -> Socket connects -> setup event -> server emits updates.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Socket connections should be tied to authenticated app state.
 */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

export const SOCKET_EVENTS = {
  SETUP: "setup",
  ONLINE_USERS: "online_users",
  JOIN_CHAT: "join_chat",
  GROUP_CREATED: "group_created",
  GROUP_DELETED: "group_deleted",
  PRIVATE_MESSAGE: "private_message",
  MESSAGE_RECEIVED: "message_received",
  MESSAGE_DELIVERED: "message_delivered",
  TYPING: "typing",
  STOP_TYPING: "stop_typing",
  SEEN: "seen",
};

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!user?._id) {
      return undefined;
    }

    const nextSocket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
      withCredentials: true,
    });

    nextSocket.emit(SOCKET_EVENTS.SETUP, user._id);
    nextSocket.on(SOCKET_EVENTS.ONLINE_USERS, setOnlineUsers);
    nextSocket.on("connect", () => {
      setSocket(nextSocket);
    });

    return () => {
      nextSocket.disconnect();
      queueMicrotask(() => {
        setSocket(null);
        setOnlineUsers([]);
      });
    };
  }, [user?._id]);

  const value = useMemo(() => ({ socket, onlineUsers }), [socket, onlineUsers]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
