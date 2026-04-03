import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  // Read logged-in user from localStorage on every route change
  useEffect(() => {
    const stored = localStorage.getItem("loggedUser");
    if (stored) setUser(JSON.parse(stored));
    else setUser(null);
  }, [router.pathname]);

  function handleLogout() {
    localStorage.removeItem("loggedUser");
    setUser(null);
    router.push("/");
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <a href="/" className="navbar-logo">
          🚌 Bus<span>Go</span>
        </a>

        {/* Right links */}
        <div className="navbar-links">
          <a href="/">Home</a>
          {user ? (
            <>
              <span className="navbar-user">Hi, {user.name.split(" ")[0]}</span>
              <button className="navbar-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login">Login</a>
              <a href="/register" className="btn-nav">Register</a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}