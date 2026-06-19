/**
 * FILE PURPOSE
 * ----------------------------
 * Shows searchable users and existing chats.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Let users select people/chats to start conversations.
 *
 * USED BY
 * ----------------------------
 * Chat.jsx
 *
 * REQUEST FLOW
 * ----------------------------
 * Search/select -> Parent chat page loads or creates selected chat.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Sidebar state is lifted to the Chat page because it controls the main chat box.
 */
import { useMemo, useState } from "react";
import { FiCheck, FiMessageCircle, FiPlus, FiSearch, FiUser, FiUsers } from "react-icons/fi";

export const Sidebar = ({ users, chats, selectedChat, currentUserId, onlineUsers, search, onSearch, onSelectUser, onSelectChat, onCreateGroup }) => {
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const selectedUsers = useMemo(() => {
    return users.filter((user) => selectedUserIds.includes(user._id));
  }, [selectedUserIds, users]);

  const toggleUser = (userId) => {
    setSelectedUserIds((current) =>
      current.includes(userId) ? current.filter((id) => id !== userId) : [...current, userId]
    );
  };

  const handleCreateGroup = async (event) => {
    event.preventDefault();
    if (!groupName.trim() || selectedUserIds.length < 2) return;

    await onCreateGroup({ name: groupName.trim(), participantIds: selectedUserIds });
    setGroupName("");
    setSelectedUserIds([]);
    setShowGroupForm(false);
  };

  return (
    <aside className="sidebar">
      <label className="input-wrap search-wrap">
        <FiSearch />
        <input
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Search users"
          className="field"
        />
      </label>

      <section>
        <div className="sidebar-section-title">
          <h2><FiUsers /> Groups</h2>
          <button className="icon-action" type="button" onClick={() => setShowGroupForm((value) => !value)} aria-label="Create group">
            <FiPlus />
          </button>
        </div>

        {showGroupForm ? (
          <form className="group-form" onSubmit={handleCreateGroup}>
            <input
              className="mini-field"
              value={groupName}
              onChange={(event) => setGroupName(event.target.value)}
              placeholder="Group name"
            />
            <div className="group-user-list">
              {users.map((user) => (
                <button
                  key={user._id}
                  type="button"
                  className={selectedUserIds.includes(user._id) ? "group-user selected" : "group-user"}
                  onClick={() => toggleUser(user._id)}
                >
                  <span>{user.name}</span>
                  {selectedUserIds.includes(user._id) ? <FiCheck /> : null}
                </button>
              ))}
            </div>
            <small>{selectedUsers.length ? `${selectedUsers.length} selected` : "Select at least 2 users"}</small>
            <button className="create-group-btn" type="submit" disabled={!groupName.trim() || selectedUserIds.length < 2}>
              <FiPlus /> Create group
            </button>
          </form>
        ) : null}

        {!showGroupForm && (
          <div className="list">
            {chats.filter((chat) => chat.isGroupChat).map((chat) => (
              <button
                key={chat._id}
                type="button"
                className={selectedChat?._id === chat._id ? "list-item active" : "list-item"}
                onClick={() => onSelectChat(chat)}
              >
                <span className="avatar-letter" style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)", color: "white" }}>
                  {chat.chatName?.charAt(0)?.toUpperCase() || "G"}
                </span>
                <span className="list-copy">
                  <strong>{chat.chatName}</strong>
                  <small>{chat.participants?.length || 0} members</small>
                </span>
              </button>
            ))}
            {chats.filter((chat) => chat.isGroupChat).length === 0 && (
              <small>No groups yet</small>
            )}
          </div>
        )}
      </section>

      <section>
        <h2><FiUser /> Users</h2>
        <div className="list">
          {users.map((user) => (
            <button key={user._id} type="button" className="list-item" onClick={() => onSelectUser(user)}>
              <span className="avatar-letter">{user.name?.charAt(0) || "U"}</span>
              <span className="list-copy">
                <strong>{user.name}</strong>
                <small><span className={onlineUsers.includes(user._id) ? "status online" : "status"} />{onlineUsers.includes(user._id) ? "Online" : "Offline"}</small>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2><FiMessageCircle /> Chats</h2>
        <div className="list">
          {chats.filter((chat) => !chat.isGroupChat).map((chat) => (
            <button
              key={chat._id}
              type="button"
              className={selectedChat?._id === chat._id ? "list-item active" : "list-item"}
              onClick={() => onSelectChat(chat)}
            >
              <span className="avatar-letter">{chat.participants.find((p) => p._id !== currentUserId)?.name?.charAt(0) || "U"}</span>
              <span className="list-copy">
                <strong>{chat.participants.filter((person) => person._id !== currentUserId).map((person) => person.name).join(", ")}</strong>
                <small>{chat.lastMessage?.content || "No messages yet"}</small>
              </span>
            </button>
          ))}
          {chats.filter((chat) => !chat.isGroupChat).length === 0 && (
            <small>No chats yet</small>
          )}
        </div>
      </section>
    </aside>
  );
};
