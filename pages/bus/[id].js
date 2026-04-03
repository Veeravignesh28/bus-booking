import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import SeatLayout from "../../components/SeatLayout";

export default function SeatPage() {
  const router = useRouter();
  const { id } = router.query;

  const [bus, setBus]         = useState(null);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bus details from json-server
  useEffect(() => {
    if (!id) return;

    async function fetchBus() {
      const res  = await fetch(`http://localhost:3001/buses/${id}`);
      const data = await res.json();
      setBus(data);
      setLoading(false);
    }

    fetchBus();
  }, [id]);

  function handleProceed() {
    if (selected.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    // Check login
    const user = localStorage.getItem("loggedUser");
    if (!user) {
      // Save seat choice and redirect to login
      sessionStorage.setItem("pendingBooking", JSON.stringify({ busId: id, seats: selected }));
      router.push("/login?redirect=passenger");
      return;
    }

    // Already logged in → go to passenger details
    sessionStorage.setItem("pendingBooking", JSON.stringify({ busId: id, seats: selected }));
    router.push("/passenger");
  }

  if (loading) return <><Navbar /><p style={{ padding: 40, color: "var(--muted)" }}>Loading...</p></>;
  if (!bus)    return <><Navbar /><p style={{ padding: 40, color: "var(--muted)" }}>Bus not found.</p></>;

  const total = selected.length * bus.price;

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: "28px 20px" }}>

        {/* Heading */}
        <div className="page-title">
          <h2>Select Your Seats</h2>
          <p>{bus.name} · {bus.from} → {bus.to} · {bus.date}</p>
        </div>

        <div className="seat-page-grid">
          {/* Seat map */}
          <div className="card">
            <SeatLayout
              totalSeats={bus.totalSeats}
              bookedSeats={bus.bookedSeats}
              womenSeats={bus.womenSeats}
              selected={selected}
              onSelect={setSelected}
            />
          </div>

          {/* Booking summary sidebar */}
          <div>
            <div className="card sidebar-card">
              <h3>Booking Summary</h3>

              <div className="info-row"><span className="key">Bus</span><span className="val">{bus.name}</span></div>
              <div className="info-row"><span className="key">Type</span><span className="val">{bus.type}</span></div>
              <div className="info-row"><span className="key">Route</span><span className="val">{bus.from} → {bus.to}</span></div>
              <div className="info-row"><span className="key">Departure</span><span className="val">{bus.departure}</span></div>
              <div className="info-row"><span className="key">Price/seat</span><span className="val">₹{bus.price}</span></div>
              <div className="info-row">
                <span className="key">Available</span>
                <span className="val">{bus.totalSeats - bus.bookedSeats.length} seats</span>
              </div>

              {selected.length > 0 && (
                <div className="info-row">
                  <span className="key">Selected</span>
                  <span className="val" style={{ color: "var(--orange)" }}>
                    {[...selected].sort((a, b) => a - b).join(", ")}
                  </span>
                </div>
              )}

              <div className="total-row">
                <span>Total</span>
                <span className="val">₹{total}</span>
              </div>

              <button
                className="btn btn-primary btn-full"
                style={{ marginTop: 18 }}
                onClick={handleProceed}
              >
                Proceed →
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}