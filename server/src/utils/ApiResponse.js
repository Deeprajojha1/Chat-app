/**
 * FILE PURPOSE
 * ----------------------------
 * Keeps successful API response shape consistent.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Wrap data with success and message fields.
 *
 * USED BY
 * ----------------------------
 * Controllers
 *
 * REQUEST FLOW
 * ----------------------------
 * Controller receives data -> ApiResponse -> res.json.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Consistent response contracts simplify frontend API handling.
 */
export class ApiResponse {
  constructor(message, data = null) {
    this.success = true;
    this.message = message;
    this.data = data;
  }
}
