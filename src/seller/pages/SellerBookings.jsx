import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "react-toastify/dist/ReactToastify.css";

function SellerBookings() {
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("access");

  // =========================
  // 🔥 FETCH BOOKINGS
  // =========================
  const fetchBookings = async () => {
    try {
      const res = await API.get("rental/seller-bookings/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // SORT LATEST FIRST
      const sorted = res.data.sort((a, b) => b.id - a.id);
      setBookings(sorted);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load bookings ❌");
    }
  };

  useEffect(() => {
    fetchBookings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =========================
  // 🔥 UPDATE BOOKING
  // =========================
  const updateBooking = async (id, action) => {
    try {
      await API.post(
        `rental/seller-update/${id}/`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Booking ${action}ed ✅`);
      fetchBookings();
    } catch (err) {
      toast.error("Update failed ❌");
    }
  };

  // =========================
  // 🔥 FILTER LOGIC (Date + Search)
  // =========================
  const filteredBookings = bookings.filter((b) => {
    const start = new Date(b.start_date);
    const matchesDate = start.toDateString() === selectedDate.toDateString();
    const matchesSearch = 
      b.car?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesDate && matchesSearch;
  });

  return (
    <div style={styles.container}>
      <ToastContainer />
      
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Seller Bookings 📦</h1>
          <p style={styles.subtitle}>Manage your car rentals and track schedules</p>
        </div>
        <div style={styles.searchContainer}>
          <input 
            type="text" 
            placeholder="Search car or customer..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchBar}
          />
        </div>
      </div>

      <div style={styles.mainLayout}>
        {/* LEFT COLUMN: FILTERS */}
        <div style={styles.sidebar}>
          <div style={styles.card}>
            <h3 style={{ marginBottom: "15px" }}>Filter by Date 📅</h3>
            <Calendar 
              onChange={setSelectedDate} 
              value={selectedDate} 
              className="custom-calendar"
            />
            <button 
              onClick={() => setSelectedDate(new Date())} 
              style={styles.todayBtn}
            >
              Go to Today
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: BOOKINGS LIST */}
        <div style={styles.listSection}>
          <h2 style={{ marginBottom: "20px", fontSize: "18px", color: "#64748b" }}>
            Bookings for {selectedDate.toDateString()}
          </h2>

          {filteredBookings.length === 0 ? (
            <div style={styles.emptyState}>
              <p>No bookings found matching your criteria</p>
            </div>
          ) : (
            filteredBookings.map((b) => (
              <div key={b.id} style={styles.bookingCard}>
                <div style={styles.cardContent}>
                  <img
                    src={b.car?.image || "https://via.placeholder.com/150"}
                    alt="car"
                    style={styles.carImg}
                  />

                  <div style={{ flex: 1 }}>
                    <div style={styles.cardTop}>
                      <h3 style={styles.carTitle}>{b.car?.title}</h3>
                      <div style={styles.priceTag}>₹{b.total_price}</div>
                    </div>
                    
                    <div style={styles.infoGrid}>
                      <p style={styles.infoText}>👤 <b>Customer:</b> {b.user.name}</p>
                      <p style={styles.infoText}>🗓️ <b>Duration:</b> {b.start_date} to {b.end_date}</p>
                    </div>

                    <div style={styles.badgeContainer}>
                      <span style={statusBadge(b.status)}>{b.status.toUpperCase()}</span>
                      <span style={statusBadge(b.payment_status)}>{b.payment_status.toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}
                <div style={styles.cardActions}>
                  {b.status === "pending" && (
                    <>
                      <button onClick={() => updateBooking(b.id, "confirm")} style={styles.btnAccept}>
                        Accept Booking
                      </button>
                      <button onClick={() => updateBooking(b.id, "cancel")} style={styles.btnReject}>
                        Reject
                      </button>
                    </>
                  )}

                  {b.status === "confirmed" && (
                    <button onClick={() => updateBooking(b.id, "complete")} style={styles.btnComplete}>
                      Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        .custom-calendar { width: 100% !important; border: none !important; font-family: 'Inter', sans-serif; }
        .react-calendar__tile--active { background: #6366f1 !important; border-radius: 8px; }
        .react-calendar__navigation button { font-size: 16px; font-weight: bold; }
      `}</style>
    </div>
  );
}

// ================= STYLES =================

const styles = {
  container: { padding: "40px", background: "#f1f5f9", minHeight: "100vh", fontFamily: "'Inter', sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "20px" },
  title: { fontSize: "28px", fontWeight: "800", color: "#1e293b", margin: 0 },
  subtitle: { color: "#64748b", margin: "5px 0 0 0" },
  searchContainer: { flex: 1, maxWidth: "400px" },
  searchBar: { width: "100%", padding: "12px 20px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", fontSize: "15px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" },
  mainLayout: { display: "grid", gridTemplateColumns: "350px 1fr", gap: "30px" },
  sidebar: { display: "flex", flexDirection: "column", gap: "20px" },
  card: { background: "#fff", padding: "20px", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" },
  todayBtn: { width: "100%", marginTop: "15px", padding: "10px", background: "#f1f5f9", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", color: "#6366f1" },
  listSection: { flex: 1 },
  bookingCard: { background: "#fff", borderRadius: "16px", padding: "20px", marginBottom: "20px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", transition: "transform 0.2s" },
  cardContent: { display: "flex", gap: "20px", marginBottom: "15px" },
  carImg: { width: "180px", height: "110px", objectFit: "cover", borderRadius: "12px", background: "#f8fafc" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" },
  carTitle: { fontSize: "20px", fontWeight: "700", color: "#1e293b", margin: 0 },
  priceTag: { fontSize: "18px", fontWeight: "800", color: "#6366f1" },
  infoGrid: { display: "grid", gridTemplateColumns: "1fr", gap: "5px", marginBottom: "15px" },
  infoText: { margin: 0, fontSize: "14px", color: "#475569" },
  badgeContainer: { display: "flex", gap: "10px" },
  cardActions: { display: "flex", gap: "12px", borderTop: "1px solid #f1f5f9", paddingTop: "15px" },
  btnAccept: { background: "#22c55e", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },
  btnReject: { background: "#fff", color: "#ef4444", border: "1px solid #ef4444", padding: "10px 20px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },
  btnComplete: { background: "#6366f1", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", width: "100%" },
  emptyState: { textAlign: "center", padding: "50px", background: "#fff", borderRadius: "16px", color: "#94a3b8" }
};

const statusBadge = (val) => {
  let bg = "#f1f5f9";
  let color = "#64748b";

  if (val === "confirmed" || val === "completed" || val === "paid") {
    bg = "#dcfce7"; color = "#16a34a";
  } else if (val === "pending") {
    bg = "#fef9c3"; color = "#854d0e";
  } else if (val === "cancelled" || val === "failed") {
    bg = "#fee2e2"; color = "#dc2626";
  }

  return {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "800",
    background: bg,
    color: color,
    letterSpacing: "0.5px"
  };
};

export default SellerBookings;