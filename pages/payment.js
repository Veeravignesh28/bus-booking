// pages/payment.js
// -----------------
// Step 2 of booking: pick a payment method and confirm.
// CSS classes used (from globals.css):
//   .container, .page-title, .payment-grid,
//   .card, .sidebar-card, .pay-methods, .pay-option,
//   .pay-icon, .pay-name, .pay-desc, .pay-radio,
//   .pay-notice, .info-row, .total-row,
//   .btn, .btn-primary, .btn-full, .btn-lg

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchApi } from "../utils/api";

// The three payment options
const METHODS = [
  { id: "upi",        icon: "📱", name: "UPI",                 desc: "GPay, PhonePe, Paytm"     },
  { id: "card",       icon: "💳", name: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay"   },
  { id: "netbanking", icon: "🏦", name: "Net Banking",         desc: "All major banks supported" },
];

export default function Payment() {
  const router = useRouter();

  const [bus, setBus]             = useState(null);   // bus details
  const [booking, setBooking]     = useState(null);   // seats + busId
  const [passenger, setPassenger] = useState(null);   // name, email, gender, contact
  const [method, setMethod]       = useState("upi");  // selected payment method
  const [loading, setLoading]     = useState(false);  // true while processing payment
  const [ready, setReady]         = useState(false);  // true when all data loaded

  // Load all required data from sessionStorage on mount
  useEffect(() => {
    try {
      const user     = localStorage.getItem("loggedUser");
      const pending  = sessionStorage.getItem("pendingBooking");   // busId + seats
      const pdetails = sessionStorage.getItem("passengerDetails"); // passenger info
      const busData  = sessionStorage.getItem("selectedBus");      // full bus object

      // If anything essential is missing, redirect home
      if (!user || !pending || !pdetails) {
        console.warn("Missing session data, redirecting home");
        router.push("/");
        return;
      }

      const parsedBooking   = JSON.parse(pending);
      const parsedPassenger = JSON.parse(pdetails);

      setBooking(parsedBooking);
      setPassenger(parsedPassenger);

      if (busData) {
        // Best case: bus was saved by seat-selection page
        setBus(JSON.parse(busData));
        setReady(true);
      } else {
        // Fallback: fetch bus from our API using from/to/date in pendingBooking
        const { from, to, date, busId } = parsedBooking;

        if (!from || !to || !date || !busId) {
          console.warn("pendingBooking missing fields:", parsedBooking);
          router.push("/");
          return;
        }

        fetchApi(`/api/buses/${busId}?date=${date}`)
          .then((found) => {
            if (found) { setBus(found); setReady(true); }
            else { console.warn("Bus not found:", busId); router.push("/"); }
          })
          .catch(() => router.push("/"));
      }
    } catch (err) {
      console.error("Payment init error:", err);
      router.push("/");
    }
  }, []);

  // Called when user clicks "Pay ₹XXX"
  async function handlePay() {
    if (!bus || !booking || !passenger) return;
    setLoading(true);

    // Simulate a payment delay of 1.6 seconds (demo only)
    await new Promise((r) => setTimeout(r, 1600));

    const bookingId = "BG" + Date.now().toString().slice(-8).toUpperCase();
    const user      = JSON.parse(localStorage.getItem("loggedUser"));
    const total     = booking.seats.length * bus.price;

    // Full booking object that gets saved to db.json
    const newBooking = {
      bookingId,
      userId:        user.id,
      busId:         bus.id,
      busName:       bus.name,
      from:          bus.from,
      to:            bus.to,
      date:          bus.date,
      departure:     bus.departure,
      arrival:       bus.arrival,
      seats:         booking.seats,
      passenger,
      paymentMethod: method,
      total,
      bookedAt:      new Date().toISOString(),
    };

    // ✅ Save booking to db.json via our API route
    // The API also updates the bus's bookedSeats automatically
    await fetchApi("/api/bookings", {
      method:  "POST",
      body:    JSON.stringify(newBooking),
    });

    // Save for the confirmation page to display
    sessionStorage.setItem("confirmation", JSON.stringify(newBooking));

    // Clean up session data we no longer need
    sessionStorage.removeItem("pendingBooking");
    sessionStorage.removeItem("passengerDetails");
    sessionStorage.removeItem("selectedBus");

    router.push("/confirmation");
  }

  // Show loading screen while data is being fetched
  if (!ready) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ padding: "60px 20px", textAlign: "center" }}>
          <p style={{ color: "var(--muted)" }}>Loading payment details…</p>
        </div>
      </>
    );
  }

  const total = booking.seats.length * bus.price;

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: "28px 20px", maxWidth: 800 }}>

        {/* .page-title → heading + subtitle block */}
        <div className="page-title">
          <h2>Payment</h2>
          <p>Step 2 of 2 — Complete your booking</p>
        </div>

        {/* .payment-grid → 2-column: form left, summary right */}
        <div className="payment-grid">

          {/* ── Left: payment method selector ── */}
          <div>
            <div className="card">
              <h3 style={{ fontSize: "0.95rem", marginBottom: 16 }}>
                Choose Payment Method
              </h3>

              {/* .pay-methods → grid of payment option cards */}
              <div className="pay-methods">
                {METHODS.map((m) => (
                  <div
                    key={m.id}
                    // .pay-option.active → orange border when selected
                    className={`pay-option ${method === m.id ? "active" : ""}`}
                    onClick={() => setMethod(m.id)}
                  >
                    {/* .pay-icon → large emoji */}
                    <span className="pay-icon">{m.icon}</span>
                    <div>
                      {/* .pay-name → bold label */}
                      <div className="pay-name">{m.name}</div>
                      {/* .pay-desc → grey subtext */}
                      <div className="pay-desc">{m.desc}</div>
                    </div>
                    {/* .pay-radio → circle indicator, fills orange when active */}
                    <div className="pay-radio"></div>
                  </div>
                ))}
              </div>

              {/* .pay-notice → dashed orange warning box */}
              <div className="pay-notice">
                ⚠️ This is a simulated payment for demo purposes only. No real transaction occurs.
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

          {/* ── Right: order summary sidebar ── */}
          <div>
            {/* .sidebar-card → sticky card on desktop */}
            <div className="card sidebar-card">
              <h3 style={{ fontSize: "0.95rem", marginBottom: 14 }}>Order Summary</h3>

              {/* .info-row → flex row: key on left, value on right */}
              <div className="info-row">
                <span className="key">Bus</span>
                <span className="val">{bus.name}</span>
              </div>
              <div className="info-row">
                <span className="key">Route</span>
                <span className="val">{bus.from} → {bus.to}</span>
              </div>
              <div className="info-row">
                <span className="key">Date</span>
                <span className="val">{bus.date}</span>
              </div>
              <div className="info-row">
                <span className="key">Departure</span>
                <span className="val">{bus.departure}</span>
              </div>
              <div className="info-row">
                <span className="key">Seats</span>
                <span className="val" style={{ color: "var(--orange)" }}>
                  {/* Sort seat numbers for display */}
                  {[...booking.seats].sort((a, b) => a - b).join(", ")}
                </span>
              </div>
              <div className="info-row">
                <span className="key">Passenger</span>
                <span className="val">{passenger.name}</span>
              </div>
              <div className="info-row">
                <span className="key">Price/seat</span>
                <span className="val">₹{bus.price}</span>
              </div>
              <div className="info-row">
                <span className="key">× Seats</span>
                <span className="val">{booking.seats.length}</span>
              </div>

              {/* .total-row → bold row with large orange amount */}
              <div className="total-row">
                <span>Total</span>
                <span className="val">₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}