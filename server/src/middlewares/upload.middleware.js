/**
 * FILE PURPOSE
 * ----------------------------
 * Parses profile image uploads from multipart forms.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Store uploaded image in memory and reject non-image/large files.
 *
 * USED BY
 * ----------------------------
 * auth.routes.js and user.routes.js
 *
 * REQUEST FLOW
 * ----------------------------
 * Multipart request -> Multer -> req.file -> Controller uploads to Cloudinary.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * File validation belongs before controller business logic.
 */
import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

const storage = multer.memoryStorage();

export const uploadAvatar = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new ApiError(400, "Only image files are allowed"));
      return;
    }

    cb(null, true);
  },
});
