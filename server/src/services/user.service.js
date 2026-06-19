/**
 * FILE PURPOSE
 * ----------------------------
 * Contains user profile and discovery business logic.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Search users and update profile fields.
 *
 * USED BY
 * ----------------------------
 * user.controller.js
 *
 * REQUEST FLOW
 * ----------------------------
 * Controller -> User service -> User repository/model -> MongoDB.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * User search must exclude the currently authenticated user.
 */
import { ApiError } from "../utils/ApiError.js";
import { findUserById, searchUsers } from "../repositories/user.repository.js";

export const listUsers = (currentUserId, search) => searchUsers(currentUserId, search);

export const updateUserProfile = async (userId, payload) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.name = payload.name ?? user.name;
  user.avatar = payload.avatar ?? user.avatar;
  await user.save();

  return user;
};
