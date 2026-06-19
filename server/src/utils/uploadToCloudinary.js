/**
 * FILE PURPOSE
 * ----------------------------
 * Uploads in-memory files to Cloudinary.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Convert a Multer memory buffer into a Cloudinary hosted image URL.
 *
 * USED BY
 * ----------------------------
 * auth.controller.js and user.controller.js
 *
 * REQUEST FLOW
 * ----------------------------
 * Controller receives req.file -> Upload utility -> Cloudinary -> secure_url.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Streams avoid writing temporary files to disk.
 */
import { cloudinary } from "../config/cloudinary.js";
import { ApiError } from "./ApiError.js";

export const uploadToCloudinary = (fileBuffer, folder = "chat-app/avatars") => {
  if (!fileBuffer) {
    return null;
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [{ width: 500, height: 500, crop: "fill", gravity: "face" }],
      },
      (error, result) => {
        if (error) {
          reject(new ApiError(500, "Image upload failed"));
          return;
        }

        resolve(result.secure_url);
      }
    );

    stream.end(fileBuffer);
  });
};
