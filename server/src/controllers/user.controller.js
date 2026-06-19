/**
 * FILE PURPOSE
 * ----------------------------
 * Handles user-related HTTP requests.
 *
 * RESPONSIBILITY
 * ----------------------------
 * List/search users and update profile data.
 *
 * USED BY
 * ----------------------------
 * user.routes.js
 *
 * REQUEST FLOW
 * ----------------------------
 * Route -> Controller -> Service -> Repository -> Database.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Protected controllers trust req.user because auth middleware already verified it.
 */
import { listUsers, updateUserProfile } from "../services/user.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

export const getUsers = asyncHandler(async (req, res) => {
  const users = await listUsers(req.user._id, req.query.search);
  res.json(new ApiResponse("Users fetched", { users }));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const avatar = req.file ? await uploadToCloudinary(req.file.buffer) : undefined;
  const user = await updateUserProfile(req.user._id, { ...req.body, avatar });
  res.json(new ApiResponse("Profile updated", { user }));
});
