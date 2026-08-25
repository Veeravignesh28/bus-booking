// pages/register.js
// ------------------
// Create a new account page.
// CSS classes used (from globals.css):
//   .auth-wrap, .auth-card, .auth-sub, .auth-footer,
//   .form-group, .form-row, .alert, .alert-error, .alert-success,
//   .btn, .btn-primary, .btn-full, .btn-lg

import { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { fetchApi } from "../utils/api";

export default function Register() {
  const router = useRouter();
  const { redirect } = router.query;

  const [name, setName]         = useState("");
  const [age, setAge]           = useState("");
  const [email, setEmail]       = useState("");
  const [contact, setContact]   = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleRegister(e) {
    e.preventDefault(); // stop form page refresh
    setError("");
    setSuccess("");

    // Basic client-side validation
    if (!name || !age || !email || !contact || !password) {
      setError("All fields are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      // ✅ POST to our own Spring Boot API route
      const data = await fetchApi("/api/auth/register", {
        method:  "POST",
        body:    JSON.stringify({ name, age, email, contact, password }),
      });

      // Auto-login: save the new user to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("loggedUser", JSON.stringify(data.user));
      setSuccess("Account created! Redirecting...");

      // Redirect after 1 second
      setTimeout(() => {
        router.push(redirect ? `/${redirect}` : "/");
      }, 1000);

    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      {/* .auth-wrap → full-height flex center */}
      <div className="auth-wrap">

        {/* .auth-card → card, max-width 430px */}
        <div className="auth-card card">
          <h2>Create Account 🚌</h2>

          {/* .auth-sub → small grey subtitle */}
          <p className="auth-sub">Join BusGo and start booking tickets</p>

          {/* Alert messages */}
          {error   && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleRegister}>

            {/* Full name */}
            <div className="form-group">
              <label>Full Name</label>
              <input
                placeholder="Raj Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Age + Contact side by side using .form-row (2-column grid) */}
            <div className="form-row">
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number" min="5" max="120"
                  placeholder="25"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Contact Number</label>
                <input
                  placeholder="9876543210"
                  maxLength="10"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              style={{ marginTop: 6 }}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account?{" "}
            <a href={`/login${redirect ? `?redirect=${redirect}` : ""}`}>
              Login here
            </a>
          </div>
        </div>
      </div>
    </>
  );
}