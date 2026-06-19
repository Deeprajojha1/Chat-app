/**
 * FILE PURPOSE
 * ----------------------------
 * Defines how users are stored in MongoDB.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Store identity, password hash, avatar, and presence fields.
 *
 * USED BY
 * ----------------------------
 * auth.service.js, user.service.js, chat.service.js, auth.middleware.js
 *
 * REQUEST FLOW
 * ----------------------------
 * Repository/Service -> User model -> MongoDB users collection.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Passwords must be hashed before saving and omitted from API responses.
 */
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    avatar: { type: String, default: "" },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.index({ name: "text", email: "text" });

export const User = mongoose.model("User", userSchema);
