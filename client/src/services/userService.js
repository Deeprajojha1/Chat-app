/**
 * FILE PURPOSE
 * ----------------------------
 * Groups user API calls.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Search users and update the current user's profile.
 *
 * USED BY
 * ----------------------------
 * Chat.jsx and Profile.jsx
 *
 * REQUEST FLOW
 * ----------------------------
 * UI -> User service -> Backend user routes.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * User discovery is protected because only logged-in users should start chats.
 */
import { api } from "../api/axios";

const toProfileFormData = (payload) => {
  const formData = new FormData();
  formData.append("name", payload.name);

  if (payload.avatar) {
    formData.append("avatar", payload.avatar);
  }

  return formData;
};

export const userService = {
  list: (search = "") => api.get("/users", { params: { search } }),
  updateProfile: (payload) => api.patch("/users/profile", toProfileFormData(payload)),
};
