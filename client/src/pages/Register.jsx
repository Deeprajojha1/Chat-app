/**
 * FILE PURPOSE
 * ----------------------------
 * Provides the registration UI.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Collect account details and call AuthContext register.
 *
 * USED BY
 * ----------------------------
 * App.jsx
 *
 * REQUEST FLOW
 * ----------------------------
 * Form submit -> Auth context -> Backend register -> Password hash -> Cookie set.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Registration sends plain password over HTTPS; server stores only the bcrypt hash.
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiImage, FiLock, FiMail, FiUser, FiUserPlus } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export const Register = () => {
  const navigate = useNavigate();
  const { register, error } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", avatar: null });
  const [preview, setPreview] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const ok = await register(form);
    if (ok) navigate("/chat");
  };

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0] || null;
    updateField("avatar", file);
    setPreview(file ? URL.createObjectURL(file) : "");
  };

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="form-heading">
          <span className="icon-badge"><FiUserPlus /></span>
          <div>
            <p className="eyebrow">Start chatting</p>
            <h1>Create account</h1>
          </div>
        </div>
        <label className="input-wrap"><FiUser /><input className="field" placeholder="Name" value={form.name} onChange={(e) => updateField("name", e.target.value)} /></label>
        <label className="input-wrap"><FiMail /><input className="field" placeholder="Email" value={form.email} onChange={(e) => updateField("email", e.target.value)} /></label>
        <label className="file-field">
          <span><FiImage /> Profile picture optional</span>
          <input accept="image/*" type="file" onChange={handleAvatarChange} />
        </label>
        {preview ? <img className="avatar-preview" src={preview} alt="Selected profile preview" /> : null}
        <label className="input-wrap"><FiLock /><input className="field" placeholder="Password" type="password" value={form.password} onChange={(e) => updateField("password", e.target.value)} /></label>
        <label className="input-wrap"><FiLock /><input className="field" placeholder="Confirm password" type="password" value={form.confirmPassword} onChange={(e) => updateField("confirmPassword", e.target.value)} /></label>
        {error ? <p className="error">{error}</p> : null}
        <button type="submit"><FiUserPlus /> Register</button>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </section>
  );
};
