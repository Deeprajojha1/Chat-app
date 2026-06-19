/**
 * FILE PURPOSE
 * ----------------------------
 * Provides the shared page frame.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Render navigation around nested route pages.
 *
 * USED BY
 * ----------------------------
 * App.jsx
 *
 * REQUEST FLOW
 * ----------------------------
 * Router -> MainLayout -> Navbar + Outlet page.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Layout routes keep common UI outside individual pages.
 */
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";

export const MainLayout = () => {
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};
