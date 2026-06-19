/**
 * FILE PURPOSE
 * ----------------------------
 * Holds database operations for chats and messages.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Encapsulate Mongoose chat/message queries.
 *
 * USED BY
 * ----------------------------
 * chat.service.js
 *
 * REQUEST FLOW
 * ----------------------------
 * Service -> Repository -> Chat/Message models -> MongoDB.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Separating query code keeps business rules readable in services.
 */
import { Chat } from "../models/Chat.js";
import { Message } from "../models/Message.js";

export const findOneToOneChat = (firstUserId, secondUserId) => {
  return Chat.findOne({ isGroupChat: false, participants: { $all: [firstUserId, secondUserId], $size: 2 } });
};

export const createChat = (participants) => Chat.create({ participants });

export const createGroupChat = ({ chatName, participants, groupAdmin }) => {
  return Chat.create({ chatName, participants, groupAdmin, isGroupChat: true });
};

export const getUserChats = (userId) => {
  return Chat.find({ participants: userId })
    .populate("participants", "-password")
    .populate("groupAdmin", "-password")
    .populate("lastMessage")
    .sort({ updatedAt: -1 });
};

export const createMessage = (payload) => Message.create(payload);

export const getChatMessages = (chatId) => {
  return Message.find({ chat: chatId })
    .populate("sender", "name email avatar")
    .populate("receiver", "name email avatar")
    .sort({ createdAt: 1 });
};

export const setLastMessage = (chatId, messageId) => {
  return Chat.findByIdAndUpdate(chatId, { lastMessage: messageId }, { new: true })
    .populate("participants", "-password")
    .populate("groupAdmin", "-password")
    .populate("lastMessage");
};

export const markMessagesSeen = (chatId, receiverId) => {
  return Message.updateMany({ chat: chatId, receiver: receiverId, seen: false }, { seen: true });
};

export const deleteGroupChat = (chatId) => {
  return Chat.deleteOne({ _id: chatId, isGroupChat: true });
};
