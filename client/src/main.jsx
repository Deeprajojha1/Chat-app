/**
 * FILE PURPOSE
 * ----------------------------
 * Mounts the React application into the browser.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Create React root and render App.
 *
 * USED BY
 * ----------------------------
 * index.html
 *
 * REQUEST FLOW
 * ----------------------------
 * Browser loads index.html -> main.jsx -> App.jsx routes.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * React starts from one root DOM node in single-page applications.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
