/**
 * FILE PURPOSE
 * ----------------------------
 * Defines chat and message endpoints.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Map protected chat URLs to controller functions and validators.
 *
 * USED BY
 * ----------------------------
 * app.js
 *
 * REQUEST FLOW
 * ----------------------------
 * /api/chats/* -> Auth middleware -> Validator -> Controller.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Chat routes persist data; socket events notify connected clients.
 */
import { Router } from "express";
import {
  createOrGetChat,
  createGroupChat,
  deleteGroupChat,
  getChats,
  getMessages,
  seenChat,
  sendMessage,
} from "../controllers/chat.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { accessChatValidator, chatIdParamValidator, groupChatValidator, sendMessageValidator } from "../validators/chat.validator.js";

const router = Router();

router.use(protect);
router.route("/").get(getChats).post(accessChatValidator, validate, createOrGetChat);
router.post("/groups", groupChatValidator, validate, createGroupChat);
router.delete("/groups/:chatId", chatIdParamValidator, validate, deleteGroupChat);
router.post("/messages", sendMessageValidator, validate, sendMessage);
router.get("/:chatId/messages", chatIdParamValidator, validate, getMessages);
router.patch("/:chatId/seen", chatIdParamValidator, validate, seenChat);

export default router;
