// pages/confirmation.js
// ----------------------
// Booking confirmed! Shows a styled ticket after payment.
// Reads booking data from sessionStorage (saved by payment.js).
// CSS classes come from styles/globals.css:
//   .confirm-wrap, .confirm-top, .success-ring,
//   .ticket-card, .ticket-head, .ticket-body,
//   .ticket-journey, .ticket-divider, .confirm-actions

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

export default function Confirmation() {
  const router = useRouter();
  const [booking, setBooking] = useState(null);

  // On page load: read the saved booking from sessionStorage
  useEffect(() => {
    const data = sessionStorage.getItem("confirmation");

    if (!data) {
      // Nothing saved — user probably refreshed or landed here directly
      router.push("/");
      return;
    }

    setBooking(JSON.parse(data));
  }, []);

  // Loading state while sessionStorage is being read
  if (!booking) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ padding: "40px 20px", textAlign: "center" }}>
          <p style={{ color: "var(--muted)" }}>Loading confirmation...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* .confirm-wrap → max-width 620px centered container */}
      <div className="confirm-wrap">

        {/* ── Top: green ring + title ── */}
        {/* .confirm-top → text-align center */}
        <div className="confirm-top">
          {/* .success-ring → green circle with emoji */}
          {/*<div className="success-ring">🎉</div>*/}
          <h2>Booking Confirmed!</h2>
          <p>Your ticket has been booked. Have a safe journey!</p>
        </div>

        {/* ── Ticket card ── */}
        {/* .ticket-card → white card with border-radius 18px */}
        <div className="ticket-card">

          {/* Orange gradient header */}
          {/* .ticket-head → orange gradient background */}
          <div className="ticket-head">
            <div className="t-id">BOOKING ID</div>
            <h3>{booking.bookingId}</h3>
            <div className="t-route">
              {booking.busName} · {booking.from} → {booking.to}
            </div>
          </div>

          {/* White body with all details */}
          {/* .ticket-body → padding 22px 26px */}
          <div className="ticket-body">

            {/* Departure & Arrival times side by side */}
            {/* .ticket-journey → 2-column grid */}
            <div className="ticket-journey">
              <div>
                {/* .tj-label → small uppercase grey label */}
                <div className="tj-label">Departure</div>
                {/* .tj-time → large bold time */}
                <div className="tj-time">{booking.departure}</div>
                {/* .tj-city → small grey city name */}
                <div className="tj-city">{booking.from}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="tj-label">Arrival</div>
                <div className="tj-time">{booking.arrival}</div>
                <div className="tj-city">{booking.to}</div>
              </div>
            </div>

            {/* Horizontal divider line */}
            {/* .ticket-divider → 1px border line */}
            <div className="ticket-divider"></div>

            {/* Booking info rows */}
            {/* .info-row → flex row with key on left, value on right */}
            <div className="info-row">
              <span className="key">Date</span>
              <span className="val">{booking.date}</span>
            </div>

            <div className="info-row">
              <span className="key">Seats</span>
              {/* Sort seats numerically before displaying */}
              <span className="val" style={{ color: "var(--orange)" }}>
                {[...booking.seats].sort((a, b) => a - b).join(", ")}
              </span>
            </div>

            <div className="info-row">
              <span className="key">Passenger</span>
              <span className="val">{booking.passenger.name}</span>
            </div>

            <div className="info-row">
              <span className="key">Contact</span>
              <span className="val">{booking.passenger.contact}</span>
            </div>

            <div className="info-row">
              <span className="key">Gender</span>
              <span className="val">{booking.passenger.gender}</span>
            </div>

            <div className="info-row">
              <span className="key">Payment Method</span>
              <span className="val" style={{ textTransform: "uppercase" }}>
                {booking.paymentMethod}
              </span>
            </div>

            {/* Total at bottom */}
            {/* .total-row → bold flex row with orange amount */}
            <div className="total-row">
              <span>Amount Paid</span>
              <span className="val">₹{booking.total}</span>
            </div>

          </div>
        </div>

        {/* ── Buttons: Print + Book Again ── */}
        {/* .confirm-actions → flex row, each button takes equal space */}
        <div className="confirm-actions">
          <button
            className="btn btn-outline"
            onClick={() => window.print()}
          >
            🖨️ Print Ticket
          </button>

          <button
            className="btn btn-primary"
            onClick={() => {
              // Clear confirmation from session so next booking starts fresh
              sessionStorage.removeItem("confirmation");
              router.push("/");
            }}
          >
          Go to Home
          </button>
        </div>

      </div>
    </>
  );
}