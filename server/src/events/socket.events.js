/**
 * FILE PURPOSE
 * ----------------------------
 * Stores Socket.IO event names in one place.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Avoid typo bugs between server and client socket events.
 *
 * USED BY
 * ----------------------------
 * socket.js and frontend SocketContext.
 *
 * REQUEST FLOW
 * ----------------------------
 * Client emits event -> Server reads event constant -> Broadcasts matching event.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Shared constants make real-time systems easier to maintain.
 */
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
