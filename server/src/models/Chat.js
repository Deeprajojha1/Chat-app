/**
 * FILE PURPOSE
 * ----------------------------
 * Defines one-to-one and group chat rooms between users.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Store participants and a pointer to the latest message.
 *
 * USED BY
 * ----------------------------
 * chat.service.js, message flows, socket handlers.
 *
 * REQUEST FLOW
 * ----------------------------
 * Chat service -> Chat model -> MongoDB chats collection.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * References let MongoDB documents stay small while still linking related data.
 */
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    chatName: { type: String, trim: true, default: "" },
    isGroupChat: { type: Boolean, default: false },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message", default: null },
  },
  { timestamps: true }
);

chatSchema.index({ participants: 1 });

export const Chat = mongoose.model("Chat", chatSchema);
