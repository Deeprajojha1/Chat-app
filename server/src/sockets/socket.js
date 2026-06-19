/**
 * FILE PURPOSE
 * ----------------------------
 * Configures Socket.IO real-time chat behavior.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Track online users, rooms, private messages, typing, and seen events.
 *
 * USED BY
 * ----------------------------
 * server.js
 *
 * REQUEST FLOW
 * ----------------------------
 * Client socket connects -> setup -> join room -> emit/receive real-time events.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Rooms let the server target one chat instead of broadcasting to everyone.
 */
import { User } from "../models/User.js";
import { SOCKET_EVENTS } from "../events/socket.events.js";
import { setupPlaygroundHandlers } from "./playground.handlers.js";

const onlineUsers = new Map();

export const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    // Setup playground handlers for learning
    setupPlaygroundHandlers(io, socket);

    socket.on(SOCKET_EVENTS.SETUP, async (userId) => {
      if (!userId) return;

      socket.userId = userId;
      socket.join(userId);
      onlineUsers.set(String(userId), socket.id);
      await User.findByIdAndUpdate(userId, { isOnline: true });
      io.emit(SOCKET_EVENTS.ONLINE_USERS, Array.from(onlineUsers.keys()));
    });

    socket.on(SOCKET_EVENTS.JOIN_CHAT, (chatId) => {
      socket.join(chatId);
    });

    socket.on(SOCKET_EVENTS.GROUP_CREATED, (chat) => {
      if (!chat?._id || !Array.isArray(chat.participants)) return;

      socket.join(chat._id);
      chat.participants.forEach((participant) => {
        const participantId = String(participant._id || participant);
        if (participantId !== String(socket.userId)) {
          io.to(participantId).emit(SOCKET_EVENTS.GROUP_CREATED, chat);
        }
      });
    });

    socket.on(SOCKET_EVENTS.GROUP_DELETED, ({ chatId, participantId }) => {
      if (!chatId || !participantId) return;
      io.to(participantId).emit(SOCKET_EVENTS.GROUP_DELETED, { chatId });
    });

    socket.on(SOCKET_EVENTS.PRIVATE_MESSAGE, (payload) => {
      // For group chats, broadcast to the chat room
      // For private chats, send to the receiver's room
      const isGroupChat = payload.chat?.isGroupChat || (payload.chat?.participants && payload.chat?.participants.length > 2);
      
      if (isGroupChat) {
        // Broadcast to all users in the chat room (excluding sender)
        socket.to(payload.chatId).emit(SOCKET_EVENTS.MESSAGE_RECEIVED, {
          chat: payload.chat,
          message: payload.message,
        });
        
        // Also emit to individual participant rooms to ensure delivery
        if (payload.chat?.participants) {
          payload.chat.participants.forEach((participant) => {
            const participantId = String(participant._id || participant);
            if (participantId !== String(socket.userId)) {
              socket.to(participantId).emit(SOCKET_EVENTS.MESSAGE_RECEIVED, {
                chat: payload.chat,
                message: payload.message,
              });
            }
          });
        }
      } else {
        const participantRooms = payload.chat?.participants
          ?.map((participant) => String(participant._id || participant))
          .filter((participantId) => participantId !== String(socket.userId)) || [];
        const rooms = [...new Set([payload.chatId, payload.receiverId, ...participantRooms].filter(Boolean))];

        socket.to(rooms).emit(SOCKET_EVENTS.MESSAGE_RECEIVED, {
          chat: payload.chat,
          message: payload.message,
        });
      }
    });

    socket.on(SOCKET_EVENTS.TYPING, ({ chatId, user }) => {
      socket.to(chatId).emit(SOCKET_EVENTS.TYPING, { chatId, user });
    });

    socket.on(SOCKET_EVENTS.STOP_TYPING, ({ chatId, user }) => {
      socket.to(chatId).emit(SOCKET_EVENTS.STOP_TYPING, { chatId, user });
    });

    socket.on(SOCKET_EVENTS.SEEN, ({ chatId, userId }) => {
      socket.to(chatId).emit(SOCKET_EVENTS.SEEN, { chatId, userId });
    });

    socket.on("disconnect", async () => {
      if (!socket.userId) return;

      onlineUsers.delete(String(socket.userId));
      await User.findByIdAndUpdate(socket.userId, { isOnline: false, lastSeen: new Date() });
      io.emit(SOCKET_EVENTS.ONLINE_USERS, Array.from(onlineUsers.keys()));
    });
  });
};
