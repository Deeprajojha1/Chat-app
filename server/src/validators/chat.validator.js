/**
 * FILE PURPOSE
 * ----------------------------
 * Defines validation rules for chat requests.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Ensure IDs and message content exist before chat controllers execute.
 *
 * USED BY
 * ----------------------------
 * chat.routes.js
 *
 * REQUEST FLOW
 * ----------------------------
 * Route -> Validator -> validate middleware -> Chat controller.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Request validation is separate from authorization.
 */
import { body, param } from "express-validator";

export const accessChatValidator = [
  body("participantId").isMongoId().withMessage("Valid participantId is required"),
];

export const sendMessageValidator = [
  body("chatId").isMongoId().withMessage("Valid chatId is required"),
  body("receiverId").optional({ nullable: true, checkFalsy: true }).isMongoId().withMessage("Valid receiverId is required"),
  body("content").trim().notEmpty().withMessage("Message content is required"),
];

export const groupChatValidator = [
  body("name").trim().notEmpty().withMessage("Group name is required"),
  body("participantIds").isArray({ min: 2 }).withMessage("Select at least two users for a group"),
  body("participantIds.*").isMongoId().withMessage("Every group participant must be valid"),
];

export const chatIdParamValidator = [
  param("chatId").isMongoId().withMessage("Valid chatId is required"),
];
