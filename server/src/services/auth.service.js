/**
 * FILE PURPOSE
 * ----------------------------
 * Contains authentication business logic.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Validate register/login rules, hash passwords, and verify credentials.
 *
 * USED BY
 * ----------------------------
 * auth.controller.js
 *
 * REQUEST FLOW
 * ----------------------------
 * Controller -> Auth service -> User repository -> MongoDB.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Controllers handle HTTP; services handle business decisions.
 */
import bcrypt from "bcrypt";
import { ApiError } from "../utils/ApiError.js";
import { createUser, findUserByEmail, findUserById } from "../repositories/user.repository.js";

const sanitizeUser = (user) => {
  const plain = user.toObject ? user.toObject() : user;
  delete plain.password;
  return plain;
};

export const registerUser = async ({ name, email, password, confirmPassword, avatar }) => {
  if (password !== confirmPassword) {
    throw new ApiError(400, "Passwords do not match");
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new ApiError(409, "Email is already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await createUser({ name, email, password: hashedPassword, avatar });
  return sanitizeUser(user);
};

export const loginUser = async ({ email, password }) => {
  const user = await findUserByEmail(email, true);
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  return sanitizeUser(user);
};

export const getAuthenticatedUser = async (userId) => {
  const user = await findUserById(userId).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};
