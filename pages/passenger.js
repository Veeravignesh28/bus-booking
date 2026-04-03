import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

export default function Passenger() {
  const router = useRouter();

  const [bus, setBus]           = useState(null);
  const [booking, setBooking]   = useState(null);
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [contact, setContact]   = useState("");
  const [gender, setGender]     = useState("");
  const [error, setError]       = useState("");

  useEffect(() => {
    // Must be logged in
    const stored = localStorage.getItem("loggedUser");
    if (!stored) { router.push("/login?redirect=passenger"); return; }

    // Must have a pending booking
    const pending = sessionStorage.getItem("pendingBooking");
    if (!pending) { router.push("/"); return; }

    const parsed = JSON.parse(pending);
    setBooking(parsed);

    // Pre-fill from logged user
    const user = JSON.parse(stored);
    setName(user.name || "");
    setEmail(user.email || "");
    setContact(user.contact || "");

    // Fetch bus details
    async function fetchBus() {
      const res  = await fetch(`http://localhost:3001/buses/${parsed.busId}`);
      const data = await res.json();
      setBus(data);
    }
    fetchBus();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !email || !contact || !gender) {
      setError("All fields are required.");
      return;
    }
    setError("");
    sessionStorage.setItem("passengerDetails", JSON.stringify({ name, email, contact, gender }));
    router.push("/payment");
  }

  if (!bus || !booking) return null;
  const total = booking.seats.length * bus.price;

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: "28px 20px", maxWidth: 800 }}>

        <div className="page-title">
          <h2>Passenger Details</h2>
          <p>Step 1 of 2 — Enter traveller information</p>
        </div>

        <div className="passenger-grid">
          {/* Form */}
          <div className="card">
            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  placeholder="As per ID proof"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
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
              <div className="form-row">
                <div className="form-group">
                  <label>Contact Number</label>
                  <input
                    placeholder="10-digit mobile"
                    maxLength="10"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: 8 }}>
                Continue to Payment →
              </button>
            </form>
          </div>

          {/* Summary sidebar */}
          <div>
            <div className="card sidebar-card">
              <h3>Trip Summary</h3>
              <div className="info-row"><span className="key">Bus</span><span className="val">{bus.name}</span></div>
              <div className="info-row"><span className="key">Route</span><span className="val">{bus.from} → {bus.to}</span></div>
              <div className="info-row"><span className="key">Date</span><span className="val">{bus.date}</span></div>
              <div className="info-row"><span className="key">Departure</span><span className="val">{bus.departure}</span></div>
              <div className="info-row">
                <span className="key">Seats</span>
                <span className="val" style={{ color: "var(--orange)" }}>
                  {[...booking.seats].sort((a, b) => a - b).join(", ")}
                </span>
              </div>
              <div className="total-row">
                <span>Total</span>
                <span className="val">₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}