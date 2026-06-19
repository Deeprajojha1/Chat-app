/**
 * FILE PURPOSE
 * ----------------------------
 * Sends validation errors before controllers run.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Read express-validator results and stop invalid requests.
 *
 * USED BY
 * ----------------------------
 * auth.routes.js, user.routes.js, chat.routes.js
 *
 * REQUEST FLOW
 * ----------------------------
 * Request -> Validator chain -> validate middleware -> Controller.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Validation protects the database and gives clients clear feedback.
 */
import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

export const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const message = errors.array().map((error) => error.msg).join(", ");
  next(new ApiError(400, message));
};
