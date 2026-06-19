/**
 * FILE PURPOSE
 * ----------------------------
 * Groups authentication API calls.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Register, login, logout, and fetch current user.
 *
 * USED BY
 * ----------------------------
 * AuthContext.jsx
 *
 * REQUEST FLOW
 * ----------------------------
 * Auth UI -> Auth context -> Auth service -> Backend auth routes.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Tokens stay in HTTP-only cookies; JavaScript only receives user data.
 */
import { api } from "../api/axios";

const toRegisterFormData = (payload) => {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("email", payload.email);
  formData.append("password", payload.password);
  formData.append("confirmPassword", payload.confirmPassword);

  if (payload.avatar) {
    formData.append("avatar", payload.avatar);
  }

  return formData;
};

export const authService = {
  register: (payload) => api.post("/auth/register", toRegisterFormData(payload)),
  login: (payload) => api.post("/auth/login", payload),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"),
};
