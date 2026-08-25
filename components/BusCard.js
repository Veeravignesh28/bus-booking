import { useRouter } from "next/router";

// ✅ Accept from/to/date as props (passed by search.js)
export default function BusCard({ bus, from, to, date }) {
  const router = useRouter();
  const available = bus.totalSeats - bus.bookedSeats.length;

  function getBadge(word) {
    if (word === "AC")      return <span key={word} className="badge badge-ac">AC</span>;
    if (word === "Sleeper") return <span key={word} className="badge badge-sleeper">Sleeper</span>;
    if (word === "Seater")  return <span key={word} className="badge badge-seater">Seater</span>;
    if (word === "Non-AC")  return <span key={word} className="badge badge-nonac">Non-AC</span>;
    return null;
  }

  function calcDuration(dep, arr) {
    const [dh, dm] = dep.split(":").map(Number);
    const [ah, am] = arr.split(":").map(Number);
    let mins = (ah * 60 + am) - (dh * 60 + dm);
    if (mins < 0) mins += 1440;
    return `${Math.floor(mins / 60)}h ${mins % 60 > 0 ? (mins % 60) + "m" : ""}`;
  }

  function handleSelect() {
    router.push(`/bus/${bus.id}?from=${from}&to=${to}&date=${date}`);
  }

  function hasDeparted() {
    const today = new Date();
    // Parse the date (yyyy-mm-dd) without timezone shift issues
    const [y, m, d] = date.split('-').map(Number);
    const searchDate = new Date(y, m - 1, d);
    
    // Check if search date is in the past
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (searchDate.getTime() < todayMidnight.getTime()) {
      return true;
    }
    
    // Check if search date is exactly today
    if (searchDate.getTime() === todayMidnight.getTime()) {
      const [depH, depM] = bus.departure.split(":").map(Number);
      if (today.getHours() > depH || (today.getHours() === depH && today.getMinutes() >= depM)) {
        return true;
      }
    }
    return false;
  }

  const isDeparted = hasDeparted();

  return (
    <div className={`bus-card ${isDeparted ? 'departed' : ''}`}>
      {/* Name & badges */}
      <div>
        <div className="bus-name" style={{ color: isDeparted ? 'var(--muted)' : 'inherit' }}>
          {bus.name}
        </div>
        <div className="bus-badges">
          {bus.type.split(" ").map((w) => getBadge(w))}
          {isDeparted && <span className="badge" style={{ background: 'var(--red)', color: 'white' }}>Departed</span>}
        </div>
      </div>

      {/* Departure */}
      <div className="bus-time">
        <div className="time" style={{ color: isDeparted ? 'var(--muted)' : 'inherit' }}>{bus.departure}</div>
        <div className="place">{bus.from}</div>
      </div>

      {/* Duration */}
      <div className="bus-duration">
        <div style={{ color: isDeparted ? 'var(--muted)' : 'inherit' }}>{calcDuration(bus.departure, bus.arrival)}</div>
        <div className="dur-line" style={{ borderColor: isDeparted ? 'var(--border)' : 'var(--orange)' }}></div>
        <div>duration</div>
      </div>

      {/* Arrival */}
      <div className="bus-time">
        <div className="time" style={{ color: isDeparted ? 'var(--muted)' : 'inherit' }}>{bus.arrival}</div>
        <div className="place">{bus.to}</div>
      </div>

      {/* Price + button */}
      <div className="bus-price-col">
        <div className="bus-price" style={{ color: isDeparted ? 'var(--muted)' : 'inherit' }}>₹{bus.price}</div>
        <div className="bus-seats">{available} seats left</div>
        <button 
          className="btn btn-primary" 
          onClick={handleSelect} 
          disabled={isDeparted}
          style={isDeparted ? { background: 'var(--border)', color: 'var(--muted)', cursor: 'not-allowed' } : {}}
        >
          {isDeparted ? 'Not Available' : 'Select Seats'}
        </button>
      </div>
    </div>
  );
}