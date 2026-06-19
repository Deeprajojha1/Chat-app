/**
 * FILE PURPOSE
 * ----------------------------
 * Centralizes environment variables so the backend reads configuration from one place.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Expose typed defaults for server, database, JWT, CORS, and cookie behavior.
 *
 * USED BY
 * ----------------------------
 * app.js, server.js, db.js, generateToken.js, auth controllers.
 *
 * REQUEST FLOW
 * ----------------------------
 * Server boot -> Load env -> Configure middleware/database/security.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Environment variables keep secrets and deployment-specific values out of code.
 */
import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/chat_application",
  jwtSecret: process.env.JWT_SECRET || "development_secret_change_me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  cookieName: process.env.JWT_COOKIE_NAME || "chat_token",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",
};

export const isProduction = env.nodeEnv === "production";
