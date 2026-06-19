/**
 * FILE PURPOSE
 * ----------------------------
 * Converts thrown errors into JSON API responses.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Handle operational errors and hide internal details in production.
 *
 * USED BY
 * ----------------------------
 * app.js
 *
 * REQUEST FLOW
 * ----------------------------
 * Controller/service error -> Error middleware -> JSON response.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Centralized error handling prevents duplicated response logic.
 */
import { isProduction } from "../config/env.js";

export const notFound = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error",
    stack: isProduction ? undefined : error.stack,
  });
};
