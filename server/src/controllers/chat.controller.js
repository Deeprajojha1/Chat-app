/**
 * FILE PURPOSE
 * ----------------------------
 * Handles chat and message HTTP requests.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Access chats, list chats/messages, send messages, and mark chats seen.
 *
 * USED BY
 * ----------------------------
 * chat.routes.js
 *
 * REQUEST FLOW
 * ----------------------------
 * Route -> Controller -> Service -> Repository -> Database.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * HTTP persists data; Socket.IO delivers real-time notifications.
 */
import { accessChat, createGroup, deleteGroup, listChats, listMessages, markChatSeen, sendChatMessage } from "../services/chat.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createOrGetChat = asyncHandler(async (req, res) => {
  const chat = await accessChat(req.user._id, req.body.participantId);
  res.status(201).json(new ApiResponse("Chat ready", { chat }));
});

export const getChats = asyncHandler(async (req, res) => {
  const chats = await listChats(req.user._id);
  res.json(new ApiResponse("Chats fetched", { chats }));
});

export const createGroupChat = asyncHandler(async (req, res) => {
  const chat = await createGroup({
    currentUserId: req.user._id,
    name: req.body.name,
    participantIds: req.body.participantIds,
  });
  res.status(201).json(new ApiResponse("Group chat created", { chat }));
});

export const getMessages = asyncHandler(async (req, res) => {
  const messages = await listMessages(req.params.chatId);
  res.json(new ApiResponse("Messages fetched", { messages }));
});

export const sendMessage = asyncHandler(async (req, res) => {
  const message = await sendChatMessage({
    chatId: req.body.chatId,
    senderId: req.user._id,
    receiverId: req.body.receiverId,
    content: req.body.content,
  });
  res.status(201).json(new ApiResponse("Message sent", { message }));
});

export const seenChat = asyncHandler(async (req, res) => {
  await markChatSeen(req.params.chatId, req.user._id);
  res.json(new ApiResponse("Messages marked seen"));
});

export const deleteGroupChat = asyncHandler(async (req, res) => {
  const result = await deleteGroup(req.params.chatId, req.user._id);
  res.json(new ApiResponse("Group deleted successfully", result));
});
