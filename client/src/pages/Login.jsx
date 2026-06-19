/**
 * FILE PURPOSE
 * ----------------------------
 * Provides the login UI.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Collect email/password and call AuthContext login.
 *
 * USED BY
 * ----------------------------
 * App.jsx
 *
 * REQUEST FLOW
 * ----------------------------
 * Form submit -> Auth context -> Backend login -> HTTP-only cookie set.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * The frontend never stores JWT in localStorage or sessionStorage.
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogIn, FiMail, FiLock } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export const Login = () => {
  const navigate = useNavigate();
  const { login, error } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const ok = await login(form);
    if (ok) navigate("/chat");
  };

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="form-heading">
          <span className="icon-badge"><FiLogIn /></span>
          <div>
            <p className="eyebrow">Welcome back</p>
            <h1>Login</h1>
          </div>
        </div>
        <label className="input-wrap"><FiMail /><input className="field" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label className="input-wrap"><FiLock /><input className="field" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        {error ? <p className="error">{error}</p> : null}
        <button type="submit"><FiLogIn /> Login</button>
        <p>New here? <Link to="/register">Create an account</Link></p>
      </form>
    </section>
  );
};
