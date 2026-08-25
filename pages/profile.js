// pages/profile.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { fetchApi } from "../utils/api";

export default function Profile() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", age: "", contact: "", password: "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null); // { type: "success" | "error", text }

  useEffect(() => {
    const stored = localStorage.getItem("loggedUser");
    if (!stored) { router.push("/login"); return; }
    const user = JSON.parse(stored);
    setForm({ name: user.name, age: user.age, contact: user.contact, password: user.password });
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    if (!form.name || !form.contact || !form.password) {
      setMsg({ type: "error", text: "Name, contact and password are required." });
      setSaving(false);
      return;
    }

    const stored = JSON.parse(localStorage.getItem("loggedUser"));

    try {
      const res = await fetchApi(`/api/users/me`, {
        method: "PUT",
        body: JSON.stringify(form),
      });

      if (res && res.id) {
        // Update localStorage so Navbar reflects new name
        localStorage.setItem("loggedUser", JSON.stringify(res));

        // ✅ Dispatch custom event so Navbar picks up the change immediately
        // without needing a page navigation
        window.dispatchEvent(new Event("userUpdated"));

        setMsg({ type: "success", text: "Profile updated successfully!" });
      }
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Something went wrong." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="container profile-container">
        <div className="page-title">
          <h2>Edit Profile</h2>
          <p>Update your personal details</p>
        </div>

        <div className="card profile-card">
          <form onSubmit={handleSubmit}>

            <div className="form-group">
              {/* ✅ Use .form-group label (defined in globals.css), not .form-label */}
              <label>Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" />
            </div>

            <div className="form-group">
              <label>Age</label>
              <input name="age" type="number" value={form.age} onChange={handleChange} placeholder="Your age" />
            </div>

            <div className="form-group">
              <label>Contact Number</label>
              <input name="contact" value={form.contact} onChange={handleChange} placeholder="10-digit number" maxLength={10} />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="New password" />
            </div>

            {msg && (
              <div className={`alert ${msg.type === "success" ? "alert-success" : "alert-error"}`}>
                {msg.text}
              </div>
            )}

            <button className="btn btn-primary btn-full" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}