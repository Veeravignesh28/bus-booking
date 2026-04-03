import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import BusCard from "../components/BusCard";

const FILTERS = ["All", "AC", "Sleeper", "Seater", "Non-AC"];

function getDateRange(startStr) {
  const dates = [];
  const base = new Date(startStr);
  for (let i = 0; i < 14; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

export default function SearchPage() {
  const router = useRouter();
  const { from, to, date } = router.query;

  const [buses, setBuses]           = useState([]);
  const [filter, setFilter]         = useState("All");
  const [activeDate, setActiveDate] = useState("");
  const [loading, setLoading]       = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    if (date) setActiveDate(date);
  }, [date]);

  useEffect(() => {
    if (!from || !to || !activeDate) return;
    setLoading(true);
    setFetchError(false);

    async function fetchBuses() {
      try {
        const res = await fetch(
          `http://localhost:3001/buses?from=${from}&to=${to}&date=${activeDate}`
        );
        if (!res.ok) throw new Error("Server error");
        const data = await res.json();
        setBuses(data);
      } catch (err) {
        console.error("Fetch failed:", err);
        setFetchError(true);
        setBuses([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBuses();
  }, [from, to, activeDate]);

  if (!from || !to || !date) return null;

  const dates = getDateRange(date);

  const filtered = buses.filter((b) => {
    if (filter === "All") return true;
    return b.type.toLowerCase().includes(filter.toLowerCase());
  });

  function fmtTab(str) {
    const d = new Date(str);
    return {
      day:   d.toLocaleDateString("en-IN", { weekday: "short" }),
      date:  d.getDate(),
      month: d.toLocaleDateString("en-IN", { month: "short" }),
    };
  }

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: "28px 20px" }}>

        {/* Search summary */}
        <div className="search-summary">
          <strong>{from}</strong>
          <span className="arrow">→</span>
          <strong>{to}</strong>
          <span>|</span>
          <span>
            {new Date(activeDate).toLocaleDateString("en-IN", {
              weekday: "long", day: "numeric", month: "long",
            })}
          </span>
          <button
            className="btn btn-outline"
            style={{ marginLeft: "auto", padding: "6px 13px", fontSize: "0.82rem" }}
            onClick={() => router.push("/")}
          >
            Modify
          </button>
        </div>

        {/* Date tabs */}
        <div className="date-tabs">
          {dates.map((d) => {
            const { day, date: dt, month } = fmtTab(d);
            return (
              <button
                key={d}
                className={`date-tab ${d === activeDate ? "active" : ""}`}
                onClick={() => setActiveDate(d)}
              >
                <strong>{dt}</strong>
                {month} · {day}
              </button>
            );
          })}
        </div>

        {/* Filter buttons */}
        <div className="filter-row">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* json-server not running warning */}
        {fetchError && (
          <div className="alert alert-error" style={{ marginBottom: 20 }}>
            ⚠️ Cannot connect to json-server. Please run:{" "}
            <code style={{ background: "rgba(0,0,0,0.3)", padding: "2px 6px", borderRadius: 4 }}>
              json-server --watch data/db.json --port 3001
            </code>{" "}
            in a separate terminal.
          </div>
        )}

        {/* Bus list */}
        {loading ? (
          <p style={{ color: "var(--muted)", padding: "20px 0" }}>Loading buses...</p>
        ) : filtered.length === 0 && !fetchError ? (
          <div className="no-buses">
            <h3>No buses found</h3>
            <p>Try a different date or filter.</p>
          </div>
        ) : (
          !fetchError && (
            <>
              <p style={{ color: "var(--muted)", fontSize: "0.86rem", marginBottom: 14 }}>
                {filtered.length} bus{filtered.length > 1 ? "es" : ""} available
              </p>
              {filtered.map((bus) => (
                <BusCard key={bus.id} bus={bus} />
              ))}
            </>
          )
        )}
      </div>
    </>
  );
}