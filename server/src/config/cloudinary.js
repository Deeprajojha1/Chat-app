/**
 * FILE PURPOSE
 * ----------------------------
 * Configures Cloudinary for profile image uploads.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Connect the Cloudinary SDK with environment credentials.
 *
 * USED BY
 * ----------------------------
 * uploadToCloudinary.js
 *
 * REQUEST FLOW
 * ----------------------------
 * Multipart request -> Multer memory file -> Cloudinary upload -> Avatar URL saved.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Cloud storage keeps user media outside the application server filesystem.
 */
import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.js";

cloudinary.config({
  cloud_name: env.cloudinaryCloudName,
  api_key: env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret,
});

export { cloudinary };
