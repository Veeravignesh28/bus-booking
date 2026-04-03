import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

const METHODS = [
  { id: "upi",        icon: "📱", name: "UPI",                   desc: "GPay, PhonePe, Paytm" },
  { id: "card",       icon: "💳", name: "Credit / Debit Card",   desc: "Visa, Mastercard, RuPay" },
  { id: "netbanking", icon: "🏦", name: "Net Banking",           desc: "All major banks supported" },
];

export default function Payment() {
  const router = useRouter();

  const [bus, setBus]           = useState(null);
  const [booking, setBooking]   = useState(null);
  const [passenger, setPassenger] = useState(null);
  const [method, setMethod]     = useState("upi");
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    const user      = localStorage.getItem("loggedUser");
    const pending   = sessionStorage.getItem("pendingBooking");
    const pdetails  = sessionStorage.getItem("passengerDetails");

    if (!user || !pending || !pdetails) { router.push("/"); return; }

    const parsed = JSON.parse(pending);
    setBooking(parsed);
    setPassenger(JSON.parse(pdetails));

    async function fetchBus() {
      const res  = await fetch(`http://localhost:3001/buses/${parsed.busId}`);
      const data = await res.json();
      setBus(data);
    }
    fetchBus();
  }, []);

  async function handlePay() {
    setLoading(true);

    // Simulate payment delay
    await new Promise((r) => setTimeout(r, 1600));

    const bookingId = "BG" + Date.now().toString().slice(-8).toUpperCase();
    const user      = JSON.parse(localStorage.getItem("loggedUser"));
    const total     = booking.seats.length * bus.price;

    // Save booking to json-server (CRUD - CREATE)
    const newBooking = {
      bookingId,
      userId:    user.id,
      busId:     bus.id,
      busName:   bus.name,
      from:      bus.from,
      to:        bus.to,
      date:      bus.date,
      departure: bus.departure,
      arrival:   bus.arrival,
      seats:     booking.seats,
      passenger,
      paymentMethod: method,
      total,
      bookedAt:  new Date().toISOString(),
    };

    await fetch("http://localhost:3001/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBooking),
    });

    // Update bus bookedSeats in json-server (CRUD - UPDATE)
    const updatedSeats = [...bus.bookedSeats, ...booking.seats];
    await fetch(`http://localhost:3001/buses/${bus.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookedSeats: updatedSeats }),
    });

    // Save confirmation to sessionStorage and navigate
    sessionStorage.setItem("confirmation", JSON.stringify(newBooking));
    sessionStorage.removeItem("pendingBooking");
    sessionStorage.removeItem("passengerDetails");
    router.push("/confirmation");
  }

  if (!bus || !booking || !passenger) return null;
  const total = booking.seats.length * bus.price;

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: "28px 20px", maxWidth: 800 }}>

        <div className="page-title">
          <h2>Payment</h2>
          <p>Step 2 of 2 — Complete your booking</p>
        </div>

        <div className="payment-grid">
          {/* Left: payment methods */}
          <div>
            <div className="card">
              <h3 style={{ fontSize: "0.95rem", marginBottom: 16 }}>Choose Payment Method</h3>

              <div className="pay-methods">
                {METHODS.map((m) => (
                  <div
                    key={m.id}
                    className={`pay-option ${method === m.id ? "active" : ""}`}
                    onClick={() => setMethod(m.id)}
                  >
                    <span className="pay-icon">{m.icon}</span>
                    <div>
                      <div className="pay-name">{m.name}</div>
                      <div className="pay-desc">{m.desc}</div>
                    </div>
                    <div className="pay-radio"></div>
                  </div>
                ))}
              </div>

              <div className="pay-notice">
                ⚠️ This is a simulated payment for demo. No real transaction occurs.
              </div>

              <button
                className="btn btn-primary btn-full btn-lg"
                onClick={handlePay}
                disabled={loading}
              >
                {loading ? "⏳ Processing..." : `Pay ₹${total}`}
              </button>
            </div>
          </div>

          {/* Right: order summary */}
          <div>
            <div className="card sidebar-card">
              <h3 style={{ fontSize: "0.95rem", marginBottom: 14 }}>Order Summary</h3>
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
              <div className="info-row"><span className="key">Passenger</span><span className="val">{passenger.name}</span></div>
              <div className="info-row"><span className="key">Price/seat</span><span className="val">₹{bus.price}</span></div>
              <div className="info-row"><span className="key">× Seats</span><span className="val">{booking.seats.length}</span></div>
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