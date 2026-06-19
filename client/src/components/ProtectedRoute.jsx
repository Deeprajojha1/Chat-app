/**
 * FILE PURPOSE
 * ----------------------------
 * Protects frontend routes from unauthenticated access.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Wait for auth loading, then redirect guests to login.
 *
 * USED BY
 * ----------------------------
 * App.jsx
 *
 * REQUEST FLOW
 * ----------------------------
 * Router -> ProtectedRoute -> Page or redirect.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Frontend protection improves UX; backend middleware still enforces real security.
 */
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="center-screen">Checking session...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};
