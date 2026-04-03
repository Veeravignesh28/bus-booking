import { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

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

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !age || !email || !contact || !password) {
      setError("All fields are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // Check if email already exists
    const checkRes  = await fetch("http://localhost:3001/users");
    const allUsers  = await checkRes.json();
    const existing  = allUsers.find((u) => u.email === email);
    if (existing) {
      setError("Email already registered. Please login.");
      return;
    }

    // POST new user to json-server
    const newUser = { name, age, email, contact, password };
    const res = await fetch("http://localhost:3001/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
    const created = await res.json();

    // Auto login after register
    localStorage.setItem("loggedUser", JSON.stringify(created));
    setSuccess("Account created! Redirecting...");
    setTimeout(() => {
      router.push(redirect ? `/${redirect}` : "/");
    }, 1000);
  }

  return (
    <>
      <Navbar />
      <div className="auth-wrap">
        <div className="auth-card card">
          <h2>Create Account 🚌</h2>
          <p className="auth-sub">Join BusGo and start booking tickets</p>

          {error   && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                placeholder="Raj Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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

            <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: 6 }}>
              Create Account
            </button>
          </form>

          <div className="auth-footer">
            Already have an account?{" "}
            <a href={`/login${redirect ? `?redirect=${redirect}` : ""}`}>Login here</a>
          </div>
        </div>
      </div>
    </>
  );
}