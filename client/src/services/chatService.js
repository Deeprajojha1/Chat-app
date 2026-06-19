/**
 * FILE PURPOSE
 * ----------------------------
 * Groups chat and message API calls.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Create/access chats, fetch chat lists/messages, send messages, and mark seen.
 *
 * USED BY
 * ----------------------------
 * Chat.jsx
 *
 * REQUEST FLOW
 * ----------------------------
 * Chat UI -> Chat service -> Backend chat routes -> MongoDB.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * REST stores messages; Socket.IO notifies users instantly.
 */
import { api } from "../api/axios";

export const chatService = {
  access: (participantId) => api.post("/chats", { participantId }),
  createGroup: (payload) => api.post("/chats/groups", payload),
  list: () => api.get("/chats"),
  messages: (chatId) => api.get(`/chats/${chatId}/messages`),
  send: (payload) => api.post("/chats/messages", payload),
  markSeen: (chatId) => api.patch(`/chats/${chatId}/seen`),
  deleteGroup: (chatId) => api.delete(`/chats/groups/${chatId}`),
};
