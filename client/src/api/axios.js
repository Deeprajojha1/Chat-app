/**
 * FILE PURPOSE
 * ----------------------------
 * Creates the browser API client for backend requests.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Configure base URL, JSON headers, and cookie support for JWT auth.
 *
 * USED BY
 * ----------------------------
 * authService.js, userService.js, chatService.js
 *
 * REQUEST FLOW
 * ----------------------------
 * UI action -> Service -> Axios client -> Express API.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * withCredentials lets the browser send HTTP-only cookies to the API.
 */
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export const getApiError = (error) => {
  return error.response?.data?.message || error.message || "Something went wrong";
};
