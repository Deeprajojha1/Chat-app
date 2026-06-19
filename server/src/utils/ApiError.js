/**
 * FILE PURPOSE
 * ----------------------------
 * Provides a predictable error object for API failures.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Carry HTTP status codes and messages from services/controllers to error middleware.
 *
 * USED BY
 * ----------------------------
 * Services, controllers, and error.middleware.js
 *
 * REQUEST FLOW
 * ----------------------------
 * Service throws ApiError -> asyncHandler catches -> error middleware sends response.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Custom errors avoid leaking internal stack traces to clients.
 */
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}
