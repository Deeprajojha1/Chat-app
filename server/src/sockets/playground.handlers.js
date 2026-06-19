/**
 * FILE PURPOSE
 * ----------------------------
 * Socket.IO learning playground handlers - Beginner Friendly
 *
 * RESPONSIBILITY
 * ----------------------------
 * Handle learning concepts:
 * 1. Groups (Rooms) - socket.join()
 * 2. Broadcast to Group - socket.to(groupId).emit()
 * 3. Private Message - socket.to(userId).emit()
 *
 * USED BY
 * ----------------------------
 * socket.js
 */

const users = new Map();

export const setupPlaygroundHandlers = (io, socket) => {
  // Store user info
  socket.on("socket_join_group", ({ group, userId, userName }) => {
    socket.userId = userId;
    socket.userName = userName;
    socket.join(group);

    // Notify all in group
    io.to(group).emit("group_update", {
      message: `${userName} joined the group`,
      type: "join",
    });

    // Send user list
    broadcastUserList(io);
  });

  // Leave group
  socket.on("socket_leave_group", ({ group }) => {
    socket.leave(group);

    io.to(group).emit("group_update", {
      message: `A user left the group`,
      type: "leave",
    });
  });

  // Broadcast to group
  socket.on("broadcast_to_group", ({ group, message, sender }) => {
    io.to(group).emit("group_message", {
      group,
      message,
      sender,
      socketId: socket.id,
      timestamp: new Date().toISOString(),
    });
  });

  // Send private message to specific user
  socket.on("send_to_user", ({ toSocketId, message, sender, toUserName }) => {
    io.to(toSocketId).emit("private_message", {
      message,
      sender,
      fromSocketId: socket.id,
      timestamp: new Date().toISOString(),
    });
  });

  socket.on("disconnect", () => {
    broadcastUserList(io);
  });
};

// Helper: Broadcast list of all online users
const broadcastUserList = (io) => {
  const users = Array.from(io.sockets.sockets.values()).map((s) => ({
    socketId: s.id,
    name: s.userName || "Anonymous",
  }));

  io.emit("user_list", users);
};
