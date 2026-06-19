/**
 * FILE PURPOSE
 * ----------------------------
 * Creates JWT access tokens for authenticated users.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Sign user identity using the server secret.
 *
 * USED BY
 * ----------------------------
 * auth.controller.js
 *
 * REQUEST FLOW
 * ----------------------------
 * Login/Register -> Generate JWT -> Store in HTTP-only cookie.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * JWTs are signed, not encrypted; never store sensitive secrets inside payloads.
 */
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const generateToken = (userId) => {
  return jwt.sign({ userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
};
