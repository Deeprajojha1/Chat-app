/**
 * FILE PURPOSE
 * ----------------------------
 * Handles authentication HTTP requests.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Register, login, logout, and return the current authenticated user.
 *
 * USED BY
 * ----------------------------
 * auth.routes.js
 *
 * REQUEST FLOW
 * ----------------------------
 * Route -> Controller -> Service -> Repository -> Database.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Controllers should stay thin and delegate business logic to services.
 */
import { env, isProduction } from "../config/env.js";
import { getAuthenticatedUser, loginUser, registerUser } from "../services/auth.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateToken } from "../utils/generateToken.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const sendAuthCookie = (res, user) => {
  const token = generateToken(user._id);
  res.cookie(env.cookieName, token, cookieOptions);
};

export const register = asyncHandler(async (req, res) => {
  const avatar = req.file ? await uploadToCloudinary(req.file.buffer) : "";
  const user = await registerUser({ ...req.body, avatar });
  sendAuthCookie(res, user);
  res.status(201).json(new ApiResponse("Registered successfully", { user }));
});

export const login = asyncHandler(async (req, res) => {
  const user = await loginUser(req.body);
  sendAuthCookie(res, user);
  res.json(new ApiResponse("Logged in successfully", { user }));
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie(env.cookieName, cookieOptions);
  res.json(new ApiResponse("Logged out successfully"));
});

export const me = asyncHandler(async (req, res) => {
  const user = await getAuthenticatedUser(req.user._id);
  res.json(new ApiResponse("Current user fetched", { user }));
});
