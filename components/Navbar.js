import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  // Read user from localStorage whenever the route changes OR
  // when another tab/component updates localStorage (storage event)
  useEffect(() => {
    function syncUser() {
      const stored = localStorage.getItem("loggedUser");
      setUser(stored ? JSON.parse(stored) : null);
    }

    syncUser(); // run on mount & route change

    // Listen for programmatic updates from profile.js via custom event
    window.addEventListener("userUpdated", syncUser);
    // Listen for cross-tab updates
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("userUpdated", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, [router.pathname]);

  function handleLogout() {
    localStorage.removeItem("loggedUser");
    setUser(null);
    router.push("/");
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <a href="/" className="navbar-logo">
          🚌 RK<span>Bus</span>
        </a>

        <div className="navbar-links">
          <a href="/">Home</a>

          {user ? (
            <>
              <a href="/mybookings">My Bookings</a>
              {user.role === "ROLE_ADMIN" && (
                <a href="/admin">Dashboard</a>
              )}
              {/* Profile link only for logged-in users */}
              <a href="/profile">Profile</a>
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