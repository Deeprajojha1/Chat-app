/**
 * FILE PURPOSE
 * ----------------------------
 * Contains chat and message business logic.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Create/reuse one-to-one chats, send messages, and mark messages seen.
 *
 * USED BY
 * ----------------------------
 * chat.controller.js and socket handlers.
 *
 * REQUEST FLOW
 * ----------------------------
 * Controller/Socket -> Chat service -> Chat repository -> MongoDB.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * One-to-one chat uniqueness is enforced by finding both participants before creating.
 */
import { ApiError } from "../utils/ApiError.js";
import { Chat } from "../models/Chat.js";
import {
  createChat,
  createGroupChat,
  createMessage,
  deleteGroupChat,
  findOneToOneChat,
  getChatMessages,
  getUserChats,
  markMessagesSeen,
  setLastMessage,
} from "../repositories/chat.repository.js";
import { findUserById } from "../repositories/user.repository.js";

export const accessChat = async (currentUserId, participantId) => {
  if (!participantId || String(currentUserId) === String(participantId)) {
    throw new ApiError(400, "A second participant is required");
  }

  const participant = await findUserById(participantId);
  if (!participant) {
    throw new ApiError(404, "Participant not found");
  }

  let chat = await findOneToOneChat(currentUserId, participantId)
    .populate("participants", "-password")
    .populate("lastMessage");

  if (!chat) {
    chat = await createChat([currentUserId, participantId]);
    chat = await chat.populate("participants", "-password");
  }

  return chat;
};

export const listChats = (userId) => getUserChats(userId);

export const listMessages = (chatId) => getChatMessages(chatId);

export const createGroup = async ({ currentUserId, name, participantIds }) => {
  const uniqueParticipantIds = [...new Set((participantIds || []).map(String))]
    .filter((participantId) => participantId !== String(currentUserId));

  if (!name?.trim()) {
    throw new ApiError(400, "Group name is required");
  }

  if (uniqueParticipantIds.length < 2) {
    throw new ApiError(400, "Select at least two users for a group");
  }

  const participants = [currentUserId, ...uniqueParticipantIds];
  const chat = await createGroupChat({
    chatName: name.trim(),
    participants,
    groupAdmin: currentUserId,
  });

  return chat.populate([
    { path: "participants", select: "-password" },
    { path: "groupAdmin", select: "-password" },
  ]);
};

export const sendChatMessage = async ({ chatId, senderId, receiverId, content }) => {
  if (!content?.trim()) {
    throw new ApiError(400, "Message content is required");
  }

  const message = await createMessage({ chat: chatId, sender: senderId, receiver: receiverId, content });
  const populatedMessage = await message.populate([
    { path: "sender", select: "name email avatar" },
    { path: "receiver", select: "name email avatar" },
  ]);

  await setLastMessage(chatId, populatedMessage._id);
  return populatedMessage;
};

export const markChatSeen = (chatId, userId) => markMessagesSeen(chatId, userId);

export const deleteGroup = async (chatId, currentUserId) => {
  const chat = await Chat.findById(chatId);
  
  if (!chat) {
    throw new ApiError(404, "Chat not found");
  }
  
  if (!chat.isGroupChat) {
    throw new ApiError(400, "Can only delete group chats");
  }
  
  if (String(chat.groupAdmin) !== String(currentUserId)) {
    throw new ApiError(403, "Only group admin can delete the group");
  }
  
  await deleteGroupChat(chatId);
  return { message: "Group deleted successfully" };
};
