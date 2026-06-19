/**
 * FILE PURPOSE
 * ----------------------------
 * Socket.IO Learning Playground - Beginner Friendly
 * 
 * RESPONSIBILITY
 * ----------------------------
 * Demonstrate Socket.IO concepts in simple, step-by-step way:
 * 1. Create/Join Group (Room)
 * 2. Send Message to Group (Broadcast)
 * 3. Send Private Message to User (socket.to())
 *
 * SOCKET CONCEPTS COVERED
 * ----------------------------
 * Group = Room
 * Broadcast to Group = socket.to(roomId).emit()
 * Send to Specific User = socket.to(socketId).emit()
 */

import { useEffect, useRef, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import "./SocketPlayground.css";

export const SocketPlayground = () => {
  const { socket } = useSocket();
  const { user } = useAuth();
  
  // State Management
  const [logs, setLogs] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupMessage, setGroupMessage] = useState("");
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [privateMessage, setPrivateMessage] = useState("");
  const [connectedUsers, setConnectedUsers] = useState([]);
  
  const logsEndRef = useRef(null);

  // Scroll logs to bottom
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Add log helper
  const addLog = (type, message) => {
    setLogs((prev) => [...prev, { type, message, timestamp: new Date().toLocaleTimeString() }]);
  };

  // Initialize socket listeners
  useEffect(() => {
    if (!socket) return;

    // Listen for GROUP MESSAGE (Broadcast)
    socket.on("group_message", (data) => {
      addLog("RECEIVED", `📢 Group Message in ${data.group}: "${data.message}" (from: ${data.sender})`);
    });

    // Listen for PRIVATE MESSAGE (Direct)
    socket.on("private_message", (data) => {
      addLog("RECEIVED", `💬 Private Message: "${data.message}" (from: ${data.sender})`);
    });

    // Listen for group updates
    socket.on("group_update", (data) => {
      addLog("INFO", `✅ ${data.message}`);
    });

    // Listen for user list
    socket.on("user_list", (users) => {
      const userList = users.filter(u => u.socketId !== socket.id && u.name !== user.email);
      setConnectedUsers(userList);
    });

    return () => {
      socket.off("group_message");
      socket.off("private_message");
      socket.off("group_update");
      socket.off("user_list");
    };
  }, [socket, user.email]);

  // ============ STEP 1: CREATE/JOIN GROUP ============
  const handleCreateGroup = () => {
    if (!groupName.trim() || !socket) {
      alert("Enter group name to create");
      return;
    }

    socket.emit("socket_join_group", {
      group: groupName.trim(),
      userId: user._id,
      userName: user.email,
    });

    setJoinedGroups((prev) =>
      prev.includes(groupName.trim()) ? prev : [...prev, groupName.trim()]
    );
    setSelectedGroup(groupName.trim());
    addLog("ACTION", `✅ Created & Joined group: "${groupName.trim()}"`);
    setGroupName("");
  };

  const handleJoinExistingGroup = (group) => {
    if (!socket || joinedGroups.includes(group)) {
      alert("Already joined this group");
      return;
    }

    socket.emit("socket_join_group", {
      group: group,
      userId: user._id,
      userName: user.email,
    });

    setJoinedGroups((prev) => [...prev, group]);
    setSelectedGroup(group);
    addLog("ACTION", `✅ Joined group: "${group}"`);
  };

  // Leave group
  const handleLeaveGroup = (group) => {
    if (!socket) return;

    socket.emit("socket_leave_group", { group });
    setJoinedGroups((prev) => prev.filter((g) => g !== group));
    if (selectedGroup === group) setSelectedGroup(null);
    addLog("ACTION", `❌ Left group: "${group}"`);
  };

  // ============ STEP 2: BROADCAST TO GROUP ============
  const handleSendToGroup = () => {
    if (!groupMessage.trim() || !socket || !selectedGroup) {
      alert("Select a group and enter a message");
      return;
    }

    socket.emit("broadcast_to_group", {
      group: selectedGroup,
      message: groupMessage.trim(),
      sender: user.email,
    });

    addLog("SENT", `📢 Group "${selectedGroup}": "${groupMessage.trim()}"`);
    setGroupMessage("");
  };

  // ============ STEP 3: SEND PRIVATE MESSAGE ============
  const handleSendPrivateMessage = () => {
    if (!privateMessage.trim() || !socket || !selectedUser) {
      alert("Select a user and enter a message");
      return;
    }

    socket.emit("send_to_user", {
      toSocketId: selectedUser.socketId,
      message: privateMessage.trim(),
      sender: user.email,
      toUserName: selectedUser.name,
    });

    addLog("SENT", `💬 To ${selectedUser.name}: "${privateMessage.trim()}"`);
    setPrivateMessage("");
  };

  // Get socket info
  const getSocketInfo = () => {
    if (!socket) return "Not connected";
    return socket.id.slice(0, 12) + "...";
  };

  return (
    <div className="socket-playground">
      <div className="header-section">
        <h1>🔌 Socket.IO Learning Hub</h1>
        <p className="subtitle">Beginner-friendly way to learn Group Chat & Direct Messaging</p>
        <div className="status-bar">
          <span className={`status ${socket ? "connected" : "disconnected"}`}>
            {socket ? "✅ Connected" : "❌ Disconnected"}
          </span>
          <span className="socket-id">Socket: {getSocketInfo()}</span>
          <span className="users-count">👥 Online Users: {connectedUsers.length + 1}</span>
        </div>
      </div>

      <div className="main-container">
        {/* LEFT PANEL - STEPS */}
        <div className="steps-panel">
          {/* STEP 1 */}
          <div className="step-card">
            <div className="step-number">
              <span>STEP 1</span>
            </div>
            <div className="step-content">
              <h2>📍 Create/Join a Group</h2>
              <p className="step-description">
                Create a new group or join existing ones. Groups are like chat rooms where you can broadcast messages.
              </p>

              {/* CREATE GROUP SECTION */}
              <div className="create-section">
                <h3 className="section-title">➕ Create New Group</h3>
                <div className="input-container">
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="e.g., gaming, sports, tech"
                    onKeyPress={(e) => e.key === "Enter" && handleCreateGroup()}
                    className="input-field"
                  />
                  <button onClick={handleCreateGroup} className="btn btn-primary">
                    🆕 Create Group
                  </button>
                </div>
              </div>

              {/* JOINED GROUPS SECTION */}
              {joinedGroups.length > 0 && (
                <div className="groups-display">
                  <h3 className="section-title">📋 Your Groups</h3>
                  {joinedGroups.map((group) => (
                    <div
                      key={group}
                      className={`group-tag ${selectedGroup === group ? "active" : ""}`}
                      onClick={() => setSelectedGroup(group)}
                    >
                      <span>📌 {group}</span>
                      <button
                        onClick={() => handleLeaveGroup(group)}
                        className="remove-btn"
                        title="Leave this group"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* SUGGESTED GROUPS SECTION */}
              {joinedGroups.length > 0 && (
                <div className="suggested-groups">
                  <h3 className="section-title">💡 Popular Groups</h3>
                  <div className="suggested-list">
                    {["gaming", "sports", "tech", "music", "movies"].map((group) => (
                      !joinedGroups.includes(group) && (
                        <button
                          key={group}
                          onClick={() => handleJoinExistingGroup(group)}
                          className="btn-join-group"
                        >
                          + Join "{group}"
                        </button>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* STEP 2 */}
          <div className="step-card">
            <div className="step-number">
              <span>STEP 2</span>
            </div>
            <div className="step-content">
              <h2>📢 Send Message to Group</h2>
              <p className="step-description">
                Message everyone in the selected group at once. (socket.to(group).emit)
              </p>

              {selectedGroup ? (
                <>
                  <div className="selected-group">
                    Selected: <strong>{selectedGroup}</strong>
                  </div>
                  <div className="input-container">
                    <input
                      type="text"
                      value={groupMessage}
                      onChange={(e) => setGroupMessage(e.target.value)}
                      placeholder="Type your message..."
                      onKeyPress={(e) => e.key === "Enter" && handleSendToGroup()}
                      className="input-field"
                    />
                    <button onClick={handleSendToGroup} className="btn btn-success">
                      Send to Group
                    </button>
                  </div>
                </>
              ) : (
                <div className="warning">⚠️ Join a group first (Step 1)</div>
              )}
            </div>
          </div>

          {/* STEP 3 */}
          <div className="step-card">
            <div className="step-number">
              <span>STEP 3</span>
            </div>
            <div className="step-content">
              <h2>💬 Send Private Message</h2>
              <p className="step-description">
                Send a message to only one specific person. (socket.to(userId).emit)
              </p>

              {connectedUsers.length > 0 ? (
                <>
                  <div className="users-selector">
                    <label>Select a user:</label>
                    <select
                      value={selectedUser ? selectedUser.socketId : ""}
                      onChange={(e) => {
                        const user = connectedUsers.find(u => u.socketId === e.target.value);
                        setSelectedUser(user || null);
                      }}
                      className="select-field"
                    >
                      <option value="">Choose a user...</option>
                      {connectedUsers.map((u) => (
                        <option key={u.socketId} value={u.socketId}>
                          👤 {u.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedUser && (
                    <>
                      <div className="selected-user">
                        Sending to: <strong>👤 {selectedUser.name}</strong>
                      </div>
                      <div className="input-container">
                        <input
                          type="text"
                          value={privateMessage}
                          onChange={(e) => setPrivateMessage(e.target.value)}
                          placeholder="Type your private message..."
                          onKeyPress={(e) => e.key === "Enter" && handleSendPrivateMessage()}
                          className="input-field"
                        />
                        <button onClick={handleSendPrivateMessage} className="btn btn-warning">
                          Send Private
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="warning">⚠️ No other users online yet. Open another tab!</div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - LOGS */}
        <div className="logs-panel">
          <div className="logs-header">
            <h3>📋 Message Logs</h3>
            <button onClick={() => setLogs([])} className="btn-clear">
              Clear
            </button>
          </div>

          <div className="logs-container">
            {logs.length === 0 ? (
              <div className="empty-logs">
                <p>No messages yet!</p>
                <small>Follow the 3 steps to start learning Socket.IO</small>
              </div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className={`log-entry log-${log.type.toLowerCase()}`}>
                  <span className="log-time">{log.timestamp}</span>
                  <span className="log-type">{log.type}</span>
                  <span className="log-message">{log.message}</span>
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION - CONCEPTS EXPLANATION */}
      <div className="concepts-footer">
        <div className="concept-item">
          <h4>📍 Group (Room)</h4>
          <p>Join a group → Send message to everyone in that group</p>
        </div>
        <div className="concept-item">
          <h4>📢 Broadcast</h4>
          <p>socket.to(groupId).emit() → Message ALL users in group</p>
        </div>
        <div className="concept-item">
          <h4>💬 Private Message</h4>
          <p>socket.to(userId).emit() → Message ONE specific user</p>
        </div>
      </div>
    </div>
  );
};
