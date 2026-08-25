import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchApi } from "../utils/api";

export default function AdminDashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [buses, setBuses] = useState([]);
  const [activeTab, setActiveTab] = useState("bookings");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newBus, setNewBus] = useState({
    name: "", type: "AC Sleeper", source: "", destination: "",
    departureTime: "", arrivalTime: "", price: "", totalSeats: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("loggedUser");
    if (!userStr) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== "ROLE_ADMIN") {
      router.push("/");
      return;
    }

    loadData();
  }, [router]);

  async function loadData() {
    try {
      setLoading(true);
      const [bookingsData, usersData, busesData] = await Promise.all([
        fetchApi("/api/admin/bookings"),
        fetchApi("/api/admin/users"),
        fetchApi("/api/buses")
      ]);
      setBookings(bookingsData || []);
      setUsers(usersData || []);
      setBuses(busesData || []);
    } catch (err) {
      setError(err.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(bookingId) {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await fetchApi(`/api/admin/bookings/${bookingId}`, { method: "DELETE" });
      setBookings((prev) => prev.filter((b) => b.bookingId !== bookingId));
    } catch (err) {
      alert("Failed to cancel booking: " + err.message);
    }
  }

  async function handleAddBus(e) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const busData = { ...newBus, price: Number(newBus.price), totalSeats: Number(newBus.totalSeats) };
      const res = await fetchApi("/api/admin/buses", {
        method: "POST",
        body: JSON.stringify(busData)
      });
      setBuses((prev) => [...prev, res]);
      setNewBus({ name: "", type: "AC Sleeper", source: "", destination: "", departureTime: "", arrivalTime: "", price: "", totalSeats: "" });
      alert("Bus added successfully!");
    } catch (err) {
      alert("Failed to add bus: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteBus(busId) {
    if (!window.confirm("Are you sure you want to delete this bus? If it has active bookings, deletion will fail.")) return;
    try {
      await fetchApi(`/api/admin/buses/${busId}`, { method: "DELETE" });
      setBuses((prev) => prev.filter((b) => b.id !== busId));
    } catch (err) {
      alert("Failed to delete bus: It might have active bookings. " + err.message);
    }
  }

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.total || 0), 0);

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: "40px 20px" }}>
        
        <div style={{ marginBottom: "32px" }}>
          <h2>Admin Control Center</h2>
          <p style={{ color: "var(--muted)", marginTop: "4px" }}>Manage system bookings, revenue, and customer details</p>
        </div>

        {loading ? (
          <p style={{ color: "var(--muted)" }}>Loading Dashboard...</p>
        ) : error ? (
          <div style={{ padding: "16px", background: "rgba(239, 68, 68, 0.1)", color: "var(--red)", borderRadius: "var(--radius)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
            {error}
          </div>
        ) : (
          <>
            {/* Analytics Section */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "36px" }}>
              <div className="card" style={{ padding: "24px" }}>
                <p style={{ color: "var(--muted)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Total Bookings</p>
                <h3 style={{ fontSize: "2rem", color: "var(--text)" }}>{bookings.length}</h3>
              </div>
              <div className="card" style={{ padding: "24px" }}>
                <p style={{ color: "var(--muted)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Total Revenue</p>
                <h3 style={{ fontSize: "2rem", color: "var(--green)" }}>₹{totalRevenue.toLocaleString()}</h3>
              </div>
              <div className="card" style={{ padding: "24px" }}>
                <p style={{ color: "var(--muted)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Registered Users</p>
                <h3 style={{ fontSize: "2rem", color: "var(--text)" }}>{users.length}</h3>
              </div>
            </div>

            {/* Interactive Tabs */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "24px", borderBottom: "1px solid var(--border)", paddingBottom: "16px" }}>
              <button 
                onClick={() => setActiveTab("bookings")} 
                className={`btn ${activeTab === "bookings" ? "btn-primary" : "btn-outline"}`}
              >
                All Bookings
              </button>
              <button 
                onClick={() => setActiveTab("users")} 
                className={`btn ${activeTab === "users" ? "btn-primary" : "btn-outline"}`}
              >
                Customer Details
              </button>
              <button 
                onClick={() => setActiveTab("buses")} 
                className={`btn ${activeTab === "buses" ? "btn-primary" : "btn-outline"}`}
              >
                Manage Buses
              </button>
            </div>

            {/* Tab Content */}
            <div>
              {activeTab === "bookings" && (
                <div>
                  <h3 style={{ marginBottom: "16px" }}>System Bookings</h3>
                  {bookings.length === 0 ? (
                    <p style={{ color: "var(--muted)" }}>No bookings found in the system.</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {bookings.map((booking) => (
                        <div key={booking.bookingId} className="card" style={{ padding: "20px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                            <div>
                              <div style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>Booking ID</div>
                              <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--orange)" }}>{booking.bookingId}</div>
                              <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "4px" }}>{new Date(booking.bookedAt).toLocaleDateString()}</div>
                            </div>
                            <button onClick={() => handleCancel(booking.bookingId)} className="btn btn-outline" style={{ padding: "6px 12px", fontSize: "0.8rem", color: "var(--red)", borderColor: "var(--red)" }}>
                              ✕ Cancel
                            </button>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "16px" }}>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>{booking.from}</div>
                            </div>
                            <div style={{ flex: 1, borderTop: "2px dashed var(--border)", margin: "0 8px" }}></div>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>{booking.to}</div>
                            </div>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                            <div style={{ fontSize: "0.9rem" }}><span style={{ color: "var(--muted)", marginRight: "8px" }}>Bus:</span> {booking.busName}</div>
                            <div style={{ fontSize: "0.9rem" }}><span style={{ color: "var(--muted)", marginRight: "8px" }}>Date:</span> {booking.date}</div>
                            <div style={{ fontSize: "0.9rem" }}><span style={{ color: "var(--muted)", marginRight: "8px" }}>Passenger:</span> {booking.passenger?.name} ({booking.passenger?.email})</div>
                            <div style={{ fontSize: "0.9rem" }}><span style={{ color: "var(--muted)", marginRight: "8px" }}>Seats:</span> <span style={{ color: "var(--orange)" }}>{booking.seats.join(", ")}</span></div>
                            <div style={{ fontSize: "0.9rem" }}><span style={{ color: "var(--muted)", marginRight: "8px" }}>Status:</span> <span style={{ color: "var(--green)" }}>{booking.status}</span></div>
                            <div style={{ fontSize: "0.9rem" }}><span style={{ color: "var(--muted)", marginRight: "8px" }}>Revenue:</span> <span style={{ fontWeight: "bold", color: "var(--green)" }}>₹{booking.total}</span></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "users" && (
                <div>
                  <h3 style={{ marginBottom: "16px" }}>Registered Customers</h3>
                  {users.length === 0 ? (
                    <p style={{ color: "var(--muted)" }}>No customers found in the system.</p>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
                      {users.map((u) => (
                        <div key={u.id} className="card" style={{ padding: "20px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                            <h4 style={{ margin: 0, fontSize: "1.1rem" }}>{u.name}</h4>
                            <span style={{ fontSize: "0.75rem", padding: "4px 8px", borderRadius: "4px", background: u.role === 'ROLE_ADMIN' ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)", color: u.role === 'ROLE_ADMIN' ? "var(--red)" : "var(--green)" }}>
                              {u.role.replace("ROLE_", "")}
                            </span>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.9rem" }}>
                            <div><span style={{ color: "var(--muted)", marginRight: "8px" }}>Email:</span> {u.email}</div>
                            <div><span style={{ color: "var(--muted)", marginRight: "8px" }}>Contact:</span> {u.contact || "N/A"}</div>
                            <div><span style={{ color: "var(--muted)", marginRight: "8px" }}>Age:</span> {u.age || "N/A"}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === "buses" && (
                <div>
                  <h3 style={{ marginBottom: "16px" }}>Manage Buses</h3>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", alignItems: "start" }}>
                    <div className="card" style={{ padding: "24px" }}>
                      <h4 style={{ marginBottom: "20px", color: "var(--orange)" }}>Add New Route</h4>
                      <form onSubmit={handleAddBus} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.85rem", color: "var(--muted)", marginBottom: "6px" }}>Bus Name / Agency</label>
                          <input type="text" value={newBus.name} onChange={e => setNewBus({...newBus, name: e.target.value})} required style={{ width: "100%", padding: "10px", background: "var(--card2)", border: "1px solid var(--border)", color: "var(--text)", borderRadius: "var(--radius)" }} />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "0.85rem", color: "var(--muted)", marginBottom: "6px" }}>Bus Type</label>
                          <select value={newBus.type} onChange={e => setNewBus({...newBus, type: e.target.value})} style={{ width: "100%", padding: "10px", background: "var(--card2)", border: "1px solid var(--border)", color: "var(--text)", borderRadius: "var(--radius)" }}>
                            <option value="AC Sleeper">AC Sleeper</option>
                            <option value="Non-AC Sleeper">Non-AC Sleeper</option>
                            <option value="AC Seater">AC Seater</option>
                            <option value="Volvo Multi-Axle">Volvo Multi-Axle</option>
                          </select>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                          <div style={{ flex: 1 }}>
                            <label style={{ display: "block", fontSize: "0.85rem", color: "var(--muted)", marginBottom: "6px" }}>From</label>
                            <input type="text" value={newBus.source} onChange={e => setNewBus({...newBus, source: e.target.value})} required style={{ width: "100%", padding: "10px", background: "var(--card2)", border: "1px solid var(--border)", color: "var(--text)", borderRadius: "var(--radius)" }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={{ display: "block", fontSize: "0.85rem", color: "var(--muted)", marginBottom: "6px" }}>To</label>
                            <input type="text" value={newBus.destination} onChange={e => setNewBus({...newBus, destination: e.target.value})} required style={{ width: "100%", padding: "10px", background: "var(--card2)", border: "1px solid var(--border)", color: "var(--text)", borderRadius: "var(--radius)" }} />
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                          <div style={{ flex: 1 }}>
                            <label style={{ display: "block", fontSize: "0.85rem", color: "var(--muted)", marginBottom: "6px" }}>Departure</label>
                            <input type="time" value={newBus.departureTime} onChange={e => setNewBus({...newBus, departureTime: e.target.value})} required style={{ width: "100%", padding: "10px", background: "var(--card2)", border: "1px solid var(--border)", color: "var(--text)", borderRadius: "var(--radius)" }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={{ display: "block", fontSize: "0.85rem", color: "var(--muted)", marginBottom: "6px" }}>Arrival</label>
                            <input type="time" value={newBus.arrivalTime} onChange={e => setNewBus({...newBus, arrivalTime: e.target.value})} required style={{ width: "100%", padding: "10px", background: "var(--card2)", border: "1px solid var(--border)", color: "var(--text)", borderRadius: "var(--radius)" }} />
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                          <div style={{ flex: 1 }}>
                            <label style={{ display: "block", fontSize: "0.85rem", color: "var(--muted)", marginBottom: "6px" }}>Price (₹)</label>
                            <input type="number" value={newBus.price} onChange={e => setNewBus({...newBus, price: e.target.value})} required min="1" style={{ width: "100%", padding: "10px", background: "var(--card2)", border: "1px solid var(--border)", color: "var(--text)", borderRadius: "var(--radius)" }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={{ display: "block", fontSize: "0.85rem", color: "var(--muted)", marginBottom: "6px" }}>Total Seats</label>
                            <input type="number" value={newBus.totalSeats} onChange={e => setNewBus({...newBus, totalSeats: e.target.value})} required min="1" max="100" style={{ width: "100%", padding: "10px", background: "var(--card2)", border: "1px solid var(--border)", color: "var(--text)", borderRadius: "var(--radius)" }} />
                          </div>
                        </div>
                        <button type="submit" className="btn btn-primary btn-full" disabled={isSubmitting} style={{ marginTop: "8px" }}>
                          {isSubmitting ? "Adding..." : "Add New Bus"}
                        </button>
                      </form>
                    </div>

                    <div>
                      <h4 style={{ marginBottom: "20px" }}>Current Fleet</h4>
                      {buses.length === 0 ? (
                        <p style={{ color: "var(--muted)" }}>No buses found.</p>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxHeight: "700px", overflowY: "auto", paddingRight: "8px" }}>
                          {buses.map(bus => (
                            <div key={bus.id} className="card" style={{ padding: "20px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                <h4 style={{ margin: 0 }}>{bus.name}</h4>
                                <span style={{ fontSize: "0.75rem", color: "var(--orange)", border: "1px solid var(--orange)", padding: "2px 8px", borderRadius: "12px" }}>{bus.type}</span>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", fontSize: "1.1rem", fontWeight: "bold" }}>
                                <span>{bus.from}</span>
                                <span style={{ color: "var(--muted)" }}>→</span>
                                <span>{bus.to}</span>
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--muted)", marginBottom: "16px" }}>
                                <span>{bus.departure} - {bus.arrival}</span>
                                <span>{bus.totalSeats} Seats</span>
                                <span style={{ color: "var(--green)", fontWeight: "bold" }}>₹{bus.price}</span>
                              </div>
                              <button onClick={() => handleDeleteBus(bus.id)} className="btn btn-outline btn-full" style={{ color: "var(--red)", borderColor: "var(--border)", fontSize: "0.85rem", padding: "8px" }}>
                                Delete Route
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
