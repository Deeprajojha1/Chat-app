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
import { FiCheck, FiCheckCircle } from "react-icons/fi";

export const MessageBubble = ({ message, currentUserId, showSenderName = false }) => {
  const isMine = message.sender?._id === currentUserId || message.sender === currentUserId;
  const senderName = message.sender?.name || "Unknown User";
  const createdAt = message.createdAt ? new Date(message.createdAt) : null;

  const getStatusIcon = () => {
    if (!isMine) return null;

    if (message.seen) {
      return <FiCheckCircle className="message-status seen" />;
    } else if (message.delivered) {
      return <FiCheckCircle className="message-status delivered" />;
    } else {
      return <FiCheck className="message-status sent" />;
    }
  };

  return (
    <div className={isMine ? "message mine" : "message"}>
      {showSenderName ? <strong className="message-sender">{senderName}</strong> : null}
      <p>{message.content}</p>
      <div className="message-footer">
        {createdAt ? <small>{createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</small> : null}
        {getStatusIcon()}
      </div>
    </div>
  );
};
