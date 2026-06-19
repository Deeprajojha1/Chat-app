/**
 * FILE PURPOSE
 * ----------------------------
 * Displays the app navigation and session actions.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Link key screens and trigger logout.
 *
 * USED BY
 * ----------------------------
 * MainLayout.jsx
 *
 * REQUEST FLOW
 * ----------------------------
 * User clicks nav/logout -> Router/Auth context handles action.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Shared layout components prevent duplicated navigation code.
 */
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiLogIn, FiLogOut, FiMessageSquare, FiUserPlus } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <span className="brand-mark"><FiMessageSquare /></span>
        ChatFlow
      </Link>
      <nav>
        {user ? (
          <>
            <NavLink to="/chat"><FiMessageSquare /> Chats</NavLink>
            <div className="user-info">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="user-avatar" />
              ) : (
                <span className="user-avatar-letter">{user.name?.charAt(0)?.toUpperCase() || "U"}</span>
              )}
              <span className="user-name">{user.name}</span>
            </div>
            <button type="button" onClick={handleLogout}><FiLogOut /> Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login"><FiLogIn /> Login</NavLink>
            <NavLink to="/register"><FiUserPlus /> Register</NavLink>
          </>
        )}
      </nav>
    </header>
  );
};
