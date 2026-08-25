import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import BusCard from "../components/BusCard";
import Footer from "@/components/Footer";
import { fetchApi } from "../utils/api";

const FILTERS = ["All", "AC", "Sleeper", "Seater", "Non-AC"];

function getDateRange(startStr) {
  const dates = [];
  const base = new Date(startStr);
  for (let i = 0; i < 7; i++) {
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
  // ✅ Initialize directly from router.query to avoid empty-string first render
  const [activeDate, setActiveDate] = useState(() => date || "");
  const [loading, setLoading]       = useState(true);

  // Keep activeDate in sync if URL date param changes
  useEffect(() => {
    if (date && activeDate === "") setActiveDate(date);
  }, [date]);

  useEffect(() => {
    if (!from || !to || !activeDate) return;

    setLoading(true);

    async function fetchBuses() {
      try {
        const data = await fetchApi(`/api/buses?from=${from}&to=${to}&date=${activeDate}`);
        setBuses(data);
      } catch (err) {
        console.error("Failed to fetch buses:", err);
        setBuses([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBuses();
  }, [from, to, activeDate]);

  if (!from || !to || !date) return null;

  const dates = getDateRange(date);

  const filtered = buses.filter((bus) => {
    if (filter === "All") return true;
    return bus.type.toLowerCase().includes(filter.toLowerCase());
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

        {loading ? (
          <p style={{ color: "var(--muted)", padding: "20px 0" }}>Loading buses...</p>
        ) : filtered.length === 0 ? (
          <div className="no-buses">
            <h3>No buses found</h3>
            <p>Try a different date or filter.</p>
          </div>
        ) : (
          <>
            <p style={{ color: "var(--muted)", fontSize: "0.86rem", marginBottom: 14 }}>
              {filtered.length} bus{filtered.length > 1 ? "es" : ""} available
            </p>
            {filtered.map((bus) => (
              <BusCard key={bus.id} bus={bus} from={from} to={to} date={activeDate} />
            ))}
          </>
        )}

      </div>
      <Footer/>
    </>
  );
}