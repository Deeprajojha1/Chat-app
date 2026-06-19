/**
 * FILE PURPOSE
 * ----------------------------
 * Opens the MongoDB connection for the application.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Connect Mongoose to MongoDB before HTTP and Socket.IO traffic is accepted.
 *
 * USED BY
 * ----------------------------
 * server.js
 *
 * REQUEST FLOW
 * ----------------------------
 * Server boot -> Connect database -> Start API server.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Apps should fail fast when the database cannot connect.
 */
import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log("MongoDB connected");
  } catch (error) {
    const usesAtlas = env.mongoUri.includes("mongodb.net");
    const hint = usesAtlas
      ? "MongoDB Atlas refused the connection. Add your current IP address in Atlas Network Access, then restart the backend."
      : "MongoDB is not reachable. Start your local MongoDB service or update MONGODB_URI in server/.env.";

    error.message = `${error.message}\n\n${hint}`;
    throw error;
  }
};
