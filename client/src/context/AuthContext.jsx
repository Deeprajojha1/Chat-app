/* eslint-disable react-refresh/only-export-components */
/**
 * FILE PURPOSE
 * ----------------------------
 * Stores authenticated user state for the React app.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Load current session, register, login, logout, and expose auth state.
 *
 * USED BY
 * ----------------------------
 * App.jsx, ProtectedRoute.jsx, Navbar.jsx, Login.jsx, Register.jsx
 *
 * REQUEST FLOW
 * ----------------------------
 * UI action -> Auth context -> Auth service -> Backend -> Context state update.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Context avoids prop drilling for app-wide auth state.
 */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getApiError } from "../api/axios";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUser = async () => {
    try {
      setLoading(true);
      const response = await authService.me();
      setUser(response.data.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    authService
      .me()
      .then((response) => {
        if (isMounted) {
          setUser(response.data.data.user);
        }
      })
      .catch(() => {
        if (isMounted) {
          setUser(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const register = async (payload) => {
    setError("");
    try {
      const response = await authService.register(payload);
      setUser(response.data.data.user);
      return true;
    } catch (err) {
      setError(getApiError(err));
      return false;
    }
  };

  const login = async (payload) => {
    setError("");
    try {
      const response = await authService.login(payload);
      setUser(response.data.data.user);
      return true;
    } catch (err) {
      setError(getApiError(err));
      return false;
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, setUser, loading, error, register, login, logout, reloadUser: loadUser }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
