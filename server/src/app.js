/**
 * FILE PURPOSE
 * ----------------------------
 * Builds and configures the Express application.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Register security, parsing, CORS, routes, and error middleware.
 *
 * USED BY
 * ----------------------------
 * server.js
 *
 * REQUEST FLOW
 * ----------------------------
 * HTTP request -> Express middleware -> Route -> Controller -> Error/response middleware.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Middleware order matters because each layer prepares data for the next one.
 */
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import userRoutes from "./routes/user.routes.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.json({ success: true, message: "Server is healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);

app.use(notFound);
app.use(errorHandler);
