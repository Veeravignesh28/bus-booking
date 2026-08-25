// pages/api/bookings.js
// ----------------------
// GET    /api/bookings        → return all bookings
// POST   /api/bookings        → create booking + update bus bookedSeats
// DELETE /api/bookings?id=XX  → cancel booking + restore bus seats

import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "db.json");

function readDb() {
  const raw = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(raw);
}

function writeDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export default function handler(req, res) {

  // ── GET: return all bookings ──
  if (req.method === "GET") {
    const db = readDb();
    return res.status(200).json(db.bookings);
  }

  // ── POST: create a booking and update bus seats ──
  if (req.method === "POST") {
    const newBooking = req.body;

    try {
      const db = readDb();

      db.bookings.push(newBooking);

      const busIndex = db.buses.findIndex((b) => b.id === newBooking.busId);
      if (busIndex !== -1) {
        const existing = db.buses[busIndex].bookedSeats || [];
        const updated  = [...new Set([...existing, ...newBooking.seats])];
        db.buses[busIndex].bookedSeats = updated;
      }

      writeDb(db);
      return res.status(201).json(newBooking);
    } catch (err) {
      console.error("Booking error:", err);
      return res.status(500).json({ error: "Failed to save booking." });
    }
  }

  // ── DELETE: cancel a booking and restore bus seats ──
  if (req.method === "DELETE") {
    const { id } = req.query; // bookingId passed as query param

    if (!id) {
      return res.status(400).json({ error: "Booking ID is required." });
    }

    try {
      const db = readDb();

      // Find the booking to cancel
      const bookingIndex = db.bookings.findIndex((b) => b.bookingId === id);
      if (bookingIndex === -1) {
        return res.status(404).json({ error: "Booking not found." });
      }

      const cancelled = db.bookings[bookingIndex];

      // Restore the seats back on the bus
      const busIndex = db.buses.findIndex((b) => b.id === cancelled.busId);
      if (busIndex !== -1) {
        db.buses[busIndex].bookedSeats = db.buses[busIndex].bookedSeats.filter(
          (seat) => !cancelled.seats.includes(seat)
        );
      }

      // Remove the booking from the array
      db.bookings.splice(bookingIndex, 1);

      writeDb(db);
      return res.status(200).json({ success: true, cancelled });
    } catch (err) {
      console.error("Cancel error:", err);
      return res.status(500).json({ error: "Failed to cancel booking." });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}