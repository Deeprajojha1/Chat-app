/**
 * FILE PURPOSE
 * ----------------------------
 * Defines frontend routes and application providers.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Compose auth, socket, layout, public routes, and protected routes.
 *
 * USED BY
 * ----------------------------
 * main.jsx
 *
 * REQUEST FLOW
 * ----------------------------
 * Browser URL -> React Router -> Page component.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Providers wrap routes so pages can access shared state.
 */
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { MainLayout } from "./layouts/MainLayout";
import { Chat } from "./pages/Chat";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";
import { Register } from "./pages/Register";
import { SocketPlayground } from "./pages/SocketPlayground";

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/chat" element={<Chat />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/socket-playground" element={<SocketPlayground />} />
              </Route>
            </Route>
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};
