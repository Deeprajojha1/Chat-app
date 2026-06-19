/**
 * FILE PURPOSE
 * ----------------------------
 * Displays the active chat conversation.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Render messages, typing status, and the message composer.
 *
 * USED BY
 * ----------------------------
 * Chat.jsx
 *
 * REQUEST FLOW
 * ----------------------------
 * User types/sends -> Parent handles API and socket flow -> ChatBox updates from props.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Controlled inputs keep form state predictable in React.
 */
import { FiMessageSquare, FiSend, FiTrash2 } from "react-icons/fi";
import { MessageBubble } from "./MessageBubble";

export const ChatBox = ({ chat, messages, currentUser, draft, typingUser, onDraftChange, onSend, onDeleteGroup }) => {
  if (!chat) {
    return (
      <section className="chat-empty">
        <span className="empty-icon"><FiMessageSquare /></span>
        <h1>Select a chat</h1>
        <p>Search a user or open an existing conversation.</p>
      </section>
    );
  }

  const title = chat.participants
    .filter((participant) => participant._id !== currentUser._id)
    .map((participant) => participant.name)
    .join(", ");
  const displayTitle = chat.isGroupChat ? chat.chatName : title;
  const isGroupAdmin = chat.isGroupChat && chat.groupAdmin?._id === currentUser._id;

  return (
    <section className="chat-box">
      <header className="chat-header">
        <div>
          <p className="eyebrow">Active conversation</p>
          <h1>{displayTitle || "Conversation"}</h1>
          {chat.isGroupChat ? <small>{chat.participants?.length || 0} members</small> : null}
        </div>
        <div className="chat-header-actions">
          {typingUser ? <span>{typingUser.name} is typing...</span> : null}
          {isGroupAdmin && (
            <button 
              type="button" 
              className="icon-action delete-group-btn" 
              onClick={() => onDeleteGroup(chat)}
              aria-label="Delete group"
            >
              <FiTrash2 />
            </button>
          )}
        </div>
      </header>

      <div className="messages">
        {messages.map((message) => (
          <MessageBubble
            key={message._id || message.createdAt}
            message={message}
            currentUserId={currentUser._id}
            showSenderName={chat.isGroupChat}
          />
        ))}
      </div>

      <form className="composer" onSubmit={onSend}>
        <input
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          placeholder="Type a message"
          className="field"
        />
        <button type="submit" aria-label="Send message"><FiSend /></button>
      </form>
    </section>
  );
};
