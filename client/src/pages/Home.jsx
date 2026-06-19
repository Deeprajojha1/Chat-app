/**
 * FILE PURPOSE
 * ----------------------------
 * Shows the first screen of the application.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Direct authenticated users to chat and guests to auth pages.
 *
 * USED BY
 * ----------------------------
 * App.jsx
 *
 * REQUEST FLOW
 * ----------------------------
 * Router -> Home page -> Link to next user action.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Home pages can be functional without becoming marketing pages.
 */
import { Link, Navigate } from "react-router-dom";
import { FiArrowRight, FiLock, FiRadio, FiShield } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export const Home = () => {
  const { user, loading } = useAuth();

  // Redirect to chat if user is authenticated
  if (loading) {
    return <div className="center-screen">Checking session...</div>;
  }

  if (user) {
    return <Navigate to="/chat" replace />;
  }

  return (
    <section className="home">
      <div className="home-copy">
        <p className="eyebrow">MERN real-time chat</p>
        <h1>Private team messaging with real-time presence.</h1>
        <p>Clean conversations, secure cookie sessions, live Socket.IO delivery, and a focused workspace built for everyday communication.</p>
        <div className="actions">
          <Link className="primary-link" to="/register">Create account <FiArrowRight /></Link>
          <Link className="secondary-link" to="/login">Login</Link>
        </div>
      </div>
      <div className="home-panel" aria-label="Product highlights">
        <div><FiRadio /><span>Live delivery</span></div>
        <div><FiShield /><span>JWT cookies</span></div>
        <div><FiLock /><span>Private chats</span></div>
      </div>
    </section>
  );
};
