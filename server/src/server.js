/**
 * FILE PURPOSE
 * ----------------------------
 * Starts the HTTP and Socket.IO servers.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Connect database, create HTTP server, attach Socket.IO, and listen on PORT.
 *
 * USED BY
 * ----------------------------
 * npm run dev / npm start
 *
 * REQUEST FLOW
 * ----------------------------
 * Process boot -> DB connect -> HTTP server -> Express routes and Socket.IO events.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Socket.IO attaches to the same HTTP server as Express.
 */
import http from "http";
import { Server } from "socket.io";
import { app } from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { initializeSocket } from "./sockets/socket.js";

const startServer = async () => {
  await connectDB();

  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:5174"],
      credentials: true,
    },
  });

  initializeSocket(io);

  await new Promise((resolve, reject) => {
    httpServer.once("error", (error) => {
      if (error.code === "EADDRINUSE") {
        error.message = `Port ${env.port} is already in use. Stop the old backend process or set a different PORT in server/.env.`;
      }
      reject(error);
    });

    httpServer.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
      resolve();
    });
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
