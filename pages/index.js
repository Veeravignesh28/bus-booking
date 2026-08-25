import { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CITIES = ["Chennai", "Coimbatore", "Tirunelveli","Bangalore", "Madurai", "Salem", "Trichy"];

export default function Home() {
  const router = useRouter();

  const today = new Date().toISOString().split("T")[0];

  const [from, setFrom]   = useState("");
  const [to, setTo]       = useState("");
  const [date, setDate]   = useState(today);
  const [error, setError] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    if (!from || !to || !date) { setError("Please fill all fields."); return; }
    if (from === to) { setError("Source and destination cannot be the same."); return; }
    setError("");
    router.push(`/search?from=${from}&to=${to}&date=${date}`);
  }

  return (
    <>
      <Navbar />
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-tag">🚌 India's Bus Network</div>
          <h1>
            Travel Smarter,<br />
            Book <span>Faster</span>
          </h1>
          <p className="hero-desc">
            Search thousands of routes, pick your seat, and pay securely.
            Your next journey is just a few clicks away.
          </p>

          <div className="search-box">
            <h2>Where are you going?</h2>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSearch}>
              <div className="search-grid">
                <div className="form-group">
                  <label>From</label>
                  <select value={from} onChange={(e) => setFrom(e.target.value)}>
                    <option value="">Select city</option>
                    {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>To</label>
                  <select value={to} onChange={(e) => setTo(e.target.value)}>
                    <option value="">Select city</option>
                    {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Travel Date</label>
                  <input
                    type="date"
                    value={date}
                    min={today}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg">
                  Search
                </button>
              </div>
            </form>
          </div>

          <div className="hero-stats">
            <div className="hero-stat"><strong>500+</strong>Routes</div>
            <div className="hero-stat"><strong>50+</strong>Operators</div>
            <div className="hero-stat"><strong>1L+</strong>Bookings</div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}