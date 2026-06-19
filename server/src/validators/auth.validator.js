/**
 * FILE PURPOSE
 * ----------------------------
 * Defines validation rules for authentication requests.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Check register and login payloads before controller logic.
 *
 * USED BY
 * ----------------------------
 * auth.routes.js
 *
 * REQUEST FLOW
 * ----------------------------
 * Route -> Validator -> validate middleware -> Auth controller.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Validating early prevents invalid data from reaching business logic.
 */
import { body } from "express-validator";

export const registerValidator = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("confirmPassword").notEmpty().withMessage("Confirm password is required"),
];

export const loginValidator = [
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];
