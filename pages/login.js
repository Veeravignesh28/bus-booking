// pages/login.js

import { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { fetchApi } from "../utils/api";

export default function Login() {
  const router = useRouter();
  const { redirect } = router.query;

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetchApi("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      if (res && res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("loggedUser", JSON.stringify(res.user));

        const target = redirect ? `/${redirect.replace(/^\/+/, "")}` : (res.user.role === "ROLE_ADMIN" ? "/admin" : "/");
        router.push(target);
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="auth-wrap">
        <div className="auth-card card">
          <h2>Welcome back 👋</h2>
          <p className="auth-sub">Login to continue your booking</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email Address or Username</label>
              <input
                type="text"
                placeholder="you@example.com or admin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
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
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account?{" "}
            <a href={`/register${redirect ? `?redirect=${redirect}` : ""}`}>
              Register here
            </a>
          </div>
        </div>
      </div>
    </>
  );
}