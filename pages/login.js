import { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

export default function Login() {
  const router = useRouter();
  const { redirect } = router.query;

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    const res   = await fetch("http://localhost:3001/users");
    const users = await res.json();
    const user  = users.find((u) => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem("loggedUser", JSON.stringify(user));
      router.push(redirect ? `/${redirect}` : "/");
    } else {
      setError("Invalid email or password.");
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: 6 }}>
              Login
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account?{" "}
            <a href={`/register${redirect ? `?redirect=${redirect}` : ""}`}>Register here</a>
          </div>
        </div>
      </div>
    </>
  );
}