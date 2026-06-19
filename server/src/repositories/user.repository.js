/**
 * FILE PURPOSE
 * ----------------------------
 * Holds database operations for users.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Keep MongoDB queries out of controllers.
 *
 * USED BY
 * ----------------------------
 * auth.service.js and user.service.js
 *
 * REQUEST FLOW
 * ----------------------------
 * Service -> Repository -> User model -> MongoDB.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Repository layer makes database access easier to test and replace.
 */
import { User } from "../models/User.js";

export const findUserByEmail = (email, includePassword = false) => {
  const query = User.findOne({ email });
  return includePassword ? query.select("+password") : query;
};

export const findUserById = (userId) => User.findById(userId);

export const createUser = (payload) => User.create(payload);

export const searchUsers = (currentUserId, search = "") => {
  const query = {
    _id: { $ne: currentUserId },
    ...(search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {}),
  };

  return User.find(query).select("-password").sort({ isOnline: -1, name: 1 });
};
