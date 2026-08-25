import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import SeatLayout from "../../components/SeatLayout";
import Footer from "../../components/Footer";
import { fetchApi } from "../../utils/api";

export default function SeatPage() {
  const router = useRouter();
  const { id, from, to, date } = router.query;

  const [bus, setBus]           = useState(null);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!id || !from || !to || !date) return;

    async function fetchBus() {
      try {
        const found = await fetchApi(`/api/buses/${id}?date=${date}`);
        if (found) setBus(found);
      } catch (err) {
        console.error("Failed to fetch bus:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBus();
  }, [id, from, to, date]);

  function handleProceed() {
    if (selected.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    sessionStorage.setItem("selectedBus", JSON.stringify(bus));
    sessionStorage.setItem(
      "pendingBooking",
      JSON.stringify({ busId: id, seats: selected, from: bus.from, to: bus.to, date: bus.date })
    );

    const user = localStorage.getItem("loggedUser");
    if (!user) {
      router.push("/login?redirect=passenger");
      return;
    }

    router.push("/passenger");
  }

  if (loading) return <><Navbar /><p className="page-loading">Loading...</p></>;
  if (!bus)    return <><Navbar /><p className="page-loading">Bus not found.</p></>;

  const total = selected.length * bus.price;

  return (
    <>
      <Navbar />
      <div className="container seat-container">

        <div className="page-title">
          <h2>Select Your Seats</h2>
          <p>{bus.name} · {bus.from} → {bus.to} · {bus.date}</p>
        </div>

        <div className="seat-page-grid">
          <div className="card">
            <SeatLayout
              totalSeats={bus.totalSeats}
              bookedSeats={bus.bookedSeats}
              womenSeats={bus.womenSeats}
              selected={selected}
              onSelect={setSelected}
            />
          </div>

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
                  <span className="val selected-seats">
                    {[...selected].sort((a, b) => a - b).join(", ")}
                  </span>
                </div>
              )}

              <div className="total-row">
                <span>Total</span>
                <span className="val">₹{total}</span>
              </div>

              <button
                className="btn btn-primary btn-full proceed-btn"
                onClick={handleProceed}
              >
                Proceed →
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}