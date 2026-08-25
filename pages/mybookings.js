// pages/mybookings.js
// --------------------
// Shows all bookings for the logged-in user.
// Allows cancelling a booking (DELETE operation → completes CRUD).
//
// GET  /api/bookings        → fetch all bookings, filter by userId
// DELETE /api/bookings?id=  → cancel a booking + restore bus seats

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { fetchApi } from "../utils/api";

export default function MyBookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [cancelling, setCancelling] = useState(null); // bookingId being cancelled

  useEffect(() => {
    const stored = localStorage.getItem("loggedUser");
    if (!stored) { router.push("/login"); return; }

    const user = JSON.parse(stored);
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      const all = await fetchApi("/api/bookings/my");
      // Sort newest first
      all.sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));
      setBookings(all);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(bookingId) {
    const confirm = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirm) return;

    setCancelling(bookingId);
    try {
      await fetchApi(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      });

      // Remove from local state instantly
      setBookings((prev) => prev.filter((b) => b.bookingId !== bookingId));
      alert("Booking cancelled successfully.");
    } catch (err) {
      console.error("Cancel error:", err);
      alert(err.message || "Something went wrong.");
    } finally {
      setCancelling(null);
    }
  }

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: "28px 20px", maxWidth: 860 }}>

        <div className="page-title">
          <h2>My Bookings</h2>
          <p>All your past and upcoming trips</p>
        </div>

        {loading ? (
          <p style={{ color: "var(--muted)", padding: "20px 0" }}>Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <div className="no-buses" style={{ marginTop: 40 }}>
            <h3>No bookings yet</h3>
            <p>You haven't booked any bus tickets.</p>
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => router.push("/")}>
              Search Buses
            </button>
          </div>
        ) : (
          bookings.map((b) => (
            <div key={b.bookingId} className="card" style={{ marginBottom: 18, padding: "20px 24px" }}>

              {/* Top row: booking ID + cancel button */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>
                    Booking ID
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--orange)" }}>
                    {b.bookingId}
                  </div>
                </div>
                <button
                  className="btn btn-outline"
                  style={{ fontSize: "0.8rem", padding: "6px 14px", color: "#e53e3e", borderColor: "#e53e3e" }}
                  onClick={() => handleCancel(b.bookingId)}
                  disabled={cancelling === b.bookingId}
                >
                  {cancelling === b.bookingId ? "Cancelling..." : "✕ Cancel"}
                </button>
              </div>

              {/* Journey */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>{b.departure}</div>
                  <div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>{b.from}</div>
                </div>
                <div style={{ flex: 1, borderTop: "2px dashed var(--border)", margin: "0 8px" }}></div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>{b.arrival}</div>
                  <div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>{b.to}</div>
                </div>
              </div>

              {/* Details grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px 0" }}>
                <div className="info-row"><span className="key">Bus</span><span className="val">{b.busName}</span></div>
                <div className="info-row"><span className="key">Date</span><span className="val">{b.date}</span></div>
                <div className="info-row">
                  <span className="key">Seats</span>
                  <span className="val" style={{ color: "var(--orange)" }}>
                    {[...b.seats].sort((a, c) => a - c).join(", ")}
                  </span>
                </div>
                <div className="info-row"><span className="key">Passenger</span><span className="val">{b.passenger.name}</span></div>
                <div className="info-row"><span className="key">Payment</span><span className="val" style={{ textTransform: "uppercase" }}>{b.paymentMethod}</span></div>
                <div className="info-row">
                  <span className="key">Amount</span>
                  <span className="val" style={{ fontWeight: 700 }}>₹{b.total}</span>
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </>
  );
}