/**
 * FILE PURPOSE
 * ----------------------------
 * Protects routes that require a logged-in user.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Read JWT from HTTP-only cookie, verify it, and attach user to req.
 *
 * USED BY
 * ----------------------------
 * user.routes.js and chat.routes.js
 *
 * REQUEST FLOW
 * ----------------------------
 * Request -> Cookie parser -> Auth middleware -> Protected controller.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * HTTP-only cookies reduce token theft risk from XSS.
 */
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.[env.cookieName];
  if (!token) {
    throw new ApiError(401, "Authentication required");
  }

  const decoded = jwt.verify(token, env.jwtSecret);
  const user = await User.findById(decoded.userId).select("-password");
  if (!user) {
    throw new ApiError(401, "Invalid authentication token");
  }

  req.user = user;
  next();
});
