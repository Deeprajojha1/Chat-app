/**
 * FILE PURPOSE
 * ----------------------------
 * Defines chat messages stored in MongoDB.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Store sender, optional receiver, chat, content, and seen status.
 *
 * USED BY
 * ----------------------------
 * chat.service.js and socket handlers.
 *
 * REQUEST FLOW
 * ----------------------------
 * Send message -> Message model -> MongoDB messages collection -> Socket emit.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Indexing chat and createdAt makes message pagination efficient.
 */
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    content: { type: String, required: true, trim: true },
    seen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

messageSchema.index({ chat: 1, createdAt: -1 });

export const Message = mongoose.model("Message", messageSchema);
