/**
 * FILE PURPOSE
 * ----------------------------
 * Removes repeated try/catch blocks from async Express controllers.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Forward rejected promises to Express error middleware.
 *
 * USED BY
 * ----------------------------
 * Controllers and route handlers.
 *
 * REQUEST FLOW
 * ----------------------------
 * Route -> asyncHandler(controller) -> next(error) on failure.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Express 5 supports async errors better, but this wrapper keeps intent explicit.
 */
export const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};
