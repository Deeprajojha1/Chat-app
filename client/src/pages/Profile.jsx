/**
 * FILE PURPOSE
 * ----------------------------
 * Lets the authenticated user edit profile basics.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Update name/avatar and refresh auth context state.
 *
 * USED BY
 * ----------------------------
 * App.jsx
 *
 * REQUEST FLOW
 * ----------------------------
 * Form submit -> User service -> Backend profile route -> Context user update.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Keep profile updates scoped; password changes should be a separate flow.
 */
import { useState } from "react";
import { FiImage, FiSave, FiUser } from "react-icons/fi";
import { getApiError } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { userService } from "../services/userService";

export const Profile = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", avatar: null });
  const [preview, setPreview] = useState(user?.avatar || "");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await userService.updateProfile(form);
      setUser(response.data.data.user);
      setMessage("Profile updated");
    } catch (err) {
      setMessage(getApiError(err));
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0] || null;
    setForm((current) => ({ ...current, avatar: file }));
    setPreview(file ? URL.createObjectURL(file) : user?.avatar || "");
  };

  return (
    <section className="profile-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="form-heading">
          <span className="icon-badge"><FiUser /></span>
          <div>
            <p className="eyebrow">Account</p>
            <h1>Profile</h1>
          </div>
        </div>
        <label className="input-wrap"><FiUser /><input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label className="file-field">
          <span><FiImage /> Profile picture</span>
          <input accept="image/*" type="file" onChange={handleAvatarChange} />
        </label>
        {preview ? <img className="avatar-preview" src={preview} alt="Profile preview" /> : null}
        {message ? <p className="notice">{message}</p> : null}
        <button type="submit"><FiSave /> Save profile</button>
      </form>
    </section>
  );
};
