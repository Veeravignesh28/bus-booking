export default function SeatLayout({ totalSeats, bookedSeats, womenSeats, selected, onSelect }) {

  function getSeatClass(num) {
    if (bookedSeats.includes(num)) return "seat seat-booked";
    if (selected.includes(num))    return "seat seat-sel";
    if (womenSeats.includes(num))  return "seat seat-women";
    return "seat";
  }

  function handleClick(num) {
    if (bookedSeats.includes(num)) return;
    if (selected.includes(num)) {
      onSelect(selected.filter((s) => s !== num));
    } else {
      onSelect([...selected, num]);
    }
  }

  // Build rows: each row has 4 seats → displayed as [A][B] | gap | [C][D]
  const rows = [];
  for (let i = 1; i <= totalSeats; i += 4) {
    rows.push([i, i + 1, i + 2, i + 3].filter((n) => n <= totalSeats));
  }

  return (
    <div>
      {/* Legend */}
      <div className="seat-legend">
        <div className="legend-item"><div className="legend-box avail"></div>Available</div>
        <div className="legend-item"><div className="legend-box booked"></div>Booked</div>
        <div className="legend-item"><div className="legend-box sel"></div>Selected</div>
        <div className="legend-item"><div className="legend-box women"></div>Women</div>
      </div>

      {/* Bus front indicator */}
      <div style={{ color: "var(--muted)", fontSize: "0.82rem", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: "1.3rem" }}>🚌</span> Front · Driver Side
      </div>

      {/* Seat rows */}
      {rows.map((row, ri) => (
        <div className="seat-row" key={ri}>
          {/* Left 2 seats */}
          {[row[0], row[1]].map((num) =>
            num ? (
              <button
                key={num}
                className={getSeatClass(num)}
                onClick={() => handleClick(num)}
                disabled={bookedSeats.includes(num)}
                title={bookedSeats.includes(num) ? "Booked" : womenSeats.includes(num) ? "Women Reserved" : `Seat ${num}`}
              >
                {num}
              </button>
            ) : <div key={"el" + ri} />
          )}

          {/* Aisle gap */}
          <div className="seat-aisle"></div>

          {/* Right 2 seats */}
          {[row[2], row[3]].map((num) =>
            num ? (
              <button
                key={num}
                className={getSeatClass(num)}
                onClick={() => handleClick(num)}
                disabled={bookedSeats.includes(num)}
                title={bookedSeats.includes(num) ? "Booked" : womenSeats.includes(num) ? "Women Reserved" : `Seat ${num}`}
              >
                {num}
              </button>
            ) : <div key={"er" + ri} />
          )}
        </div>
      ))}
    </div>
  );
}