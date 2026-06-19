/**
 * FILE PURPOSE
 * ----------------------------
 * Renders a single chat message.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Display message content, timestamp, and sent/received styling.
 *
 * USED BY
 * ----------------------------
 * ChatBox.jsx
 *
 * REQUEST FLOW
 * ----------------------------
 * Messages array -> MessageBubble -> UI.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Small presentational components keep page files easier to reason about.
 */
export const MessageBubble = ({ message, currentUserId, showSenderName = false }) => {
  const isMine = message.sender?._id === currentUserId || message.sender === currentUserId;
  const senderName = message.sender?.name || "Unknown User";
  const createdAt = message.createdAt ? new Date(message.createdAt) : null;

  return (
    <div className={isMine ? "message mine" : "message"}>
      {showSenderName ? <strong className="message-sender">{senderName}</strong> : null}
      <p>{message.content}</p>
      {createdAt ? <small>{createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</small> : null}
    </div>
  );
};
