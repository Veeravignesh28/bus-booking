import { useRouter } from "next/router";

export default function BusCard({ bus }) {
  const router = useRouter();
  const available = bus.totalSeats - bus.bookedSeats.length;

  // Build badge labels from type string
  function getBadge(word) {
    if (word === "AC") return <span key={word} className="badge badge-ac">AC</span>;
    if (word === "Sleeper") return <span key={word} className="badge badge-sleeper">Sleeper</span>;
    if (word === "Seater") return <span key={word} className="badge badge-seater">Seater</span>;
    if (word === "Non-AC") return <span key={word} className="badge badge-nonac">Non-AC</span>;
    return null;
  }

  // Duration between two HH:MM times (handles overnight)
  function calcDuration(dep, arr) {
    const [dh, dm] = dep.split(":").map(Number);
    const [ah, am] = arr.split(":").map(Number);
    let mins = (ah * 60 + am) - (dh * 60 + dm);
    if (mins < 0) mins += 1440;
    return `${Math.floor(mins / 60)}h ${mins % 60 > 0 ? (mins % 60) + "m" : ""}`;
  }

  function handleSelect() {
    router.push(`/bus/${bus.id}`);
  }

  return (
    <div className="bus-card">
      {/* Name & badges */}
      <div>
        <div className="bus-name">{bus.name}</div>
        <div className="bus-badges">
          {bus.type.split(" ").map((w) => getBadge(w))}
        </div>
      </div>

      {/* Departure */}
      <div className="bus-time">
        <div className="time">{bus.departure}</div>
        <div className="place">{bus.from}</div>
      </div>

      {/* Duration */}
      <div className="bus-duration">
        <div>{calcDuration(bus.departure, bus.arrival)}</div>
        <div className="dur-line"></div>
        <div>duration</div>
      </div>

      {/* Arrival */}
      <div className="bus-time">
        <div className="time">{bus.arrival}</div>
        <div className="place">{bus.to}</div>
      </div>

      {/* Price + button */}
      <div className="bus-price-col">
        <div className="bus-price">₹{bus.price}</div>
        <div className="bus-seats">{available} seats left</div>
        <button className="btn btn-primary" onClick={handleSelect}>
          Select Seats
        </button>
      </div>
    </div>
  );
}