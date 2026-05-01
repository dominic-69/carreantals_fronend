import React, { useEffect, useState } from "react";
import API from "../../services/api";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("access");

  const fetchBookings = async () => {
    try {
      const res = await API.get("rental/admin-bookings/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // =========================
  // 🔥 SEARCH + DATE FILTER LOGIC
  // =========================
  const filteredBookings = bookings.filter((b) => {
    // 1. Search Filter (Title, Brand, or User Name)
    const matchesSearch = 
      b.car.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.user.name.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Date Filter
    let matchesDate = true;
    if (selectedDate) {
      const start = new Date(b.start_date);
      const end = new Date(b.end_date);
      const selected = new Date(selectedDate);
      matchesDate = selected >= start && selected <= end;
    }

    return matchesSearch && matchesDate;
  });

  const dailyTotal = filteredBookings.reduce(
    (sum, b) => sum + Number(b.total_price || 0),
    0
  );

  return (
    <div style={styles.container}>
      {/* HEADER SECTION */}
      <div style={styles.header}>
        <h1 style={styles.mainTitle}>Booking Management 📊</h1>
        <div style={styles.searchWrapper}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by car, brand, or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchBar}
          />
        </div>
      </div>

      <div style={styles.layout}>
        {/* LEFT COLUMN: FILTERS & STATS */}
        <div style={styles.sidebar}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Filter by Date 📅</h3>
            <Calendar 
                onChange={setSelectedDate} 
                value={selectedDate}
                className="custom-calendar" 
            />
            {selectedDate && (
              <button onClick={() => setSelectedDate(null)} style={styles.clearBtn}>
                Reset Date Filter
              </button>
            )}
          </div>

          <div style={{ ...styles.card, background: "#1e293b", color: "#fff" }}>
            <h3 style={{ ...styles.cardTitle, color: "#fff" }}>Results Summary 📈</h3>
            <div style={styles.statRow}>
              <span>Status:</span>
              <span>{selectedDate ? "Filtered Day" : "All Time"}</span>
            </div>
            <div style={styles.statRow}>
              <span>Bookings:</span>
              <span style={styles.badge}>{filteredBookings.length}</span>
            </div>
            <div style={styles.statRow}>
              <span>Revenue:</span>
              <span style={styles.revenueText}>₹{dailyTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: BOOKINGS LIST */}
        <div style={styles.content}>
          <h3 style={{ marginBottom: "20px", color: "#64748b" }}>
            Showing {filteredBookings.length} active listings
          </h3>
          
          {filteredBookings.map((b) => (
            <div key={b.id} style={styles.bookingCard}>
              <div style={styles.cardMain}>
                {b.car.image && (
                  <img src={b.car.image} alt="car" style={styles.carThumbnail} />
                )}
                <div style={styles.carDetails}>
                  <div style={styles.topRow}>
                    <h2 style={styles.carTitle}>{b.car.title}</h2>
                    <span style={getStatusStyle(b.status)}>{b.status}</span>
                  </div>
                  <p style={styles.subInfo}>🏷️ {b.car.brand} | 📍 {b.car.location}</p>
                  <p style={styles.subInfo}>👤 Seller: {b.car.owner}</p>
                  
                  <div style={styles.divider} />
                  
                  <div style={styles.footerRow}>
                    <div>
                        <p style={styles.dateRange}>
                          {new Date(b.start_date).toLocaleDateString()} — {new Date(b.end_date).toLocaleDateString()}
                        </p>
                        <p 
                          onClick={() => setSelectedUser(b.user)} 
                          style={styles.userLink}
                        >
                          Customer: <b>{b.user.name}</b> (View Details)
                        </p>
                    </div>
                    <div style={styles.priceContainer}>
                        <span style={styles.priceLabel}>Total Paid</span>
                        <span style={styles.priceValue}>₹{b.total_price}</span>
                        <span style={{ fontSize: "11px", color: "#22c55e", fontWeight: "bold" }}>
                          {b.payment_status}
                        </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredBookings.length === 0 && (
            <div style={styles.emptyState}>
              <p>No bookings found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* USER MODAL */}
      {selectedUser && (
        <div onClick={() => setSelectedUser(null)} style={styles.modalOverlay}>
          <div onClick={(e) => e.stopPropagation()} style={styles.modalBox}>
            <div style={styles.modalHeader}>
              <h2>User Information</h2>
              <button onClick={() => setSelectedUser(null)} style={styles.modalCloseX}>✕</button>
            </div>
            
            <div style={styles.modalBody}>
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <img
                  src={selectedUser.profile_image ? `http://127.0.0.1:8000${selectedUser.profile_image}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  alt="user"
                  style={styles.modalAvatar}
                />
                <h3>{selectedUser.name}</h3>
                <p style={{ color: "#64748b" }}>{selectedUser.email}</p>
              </div>

              <div style={styles.modalGrid}>
                <div style={styles.modalItem}><b>Phone</b><br/>{selectedUser.phone}</div>
                <div style={styles.modalItem}><b>Address</b><br/>{selectedUser.address || "N/A"}</div>
              </div>
            </div>

            <button onClick={() => setSelectedUser(null)} style={styles.modalBtn}>
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================
// 🔥 HELPER STYLES
// =========================
const getStatusStyle = (status) => ({
  padding: "4px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "bold",
  textTransform: "uppercase",
  background: status === "Confirmed" ? "#dcfce7" : "#fee2e2",
  color: status === "Confirmed" ? "#16a34a" : "#dc2626",
});

const styles = {
  container: { padding: "40px", background: "#f1f5f9", minHeight: "100vh", fontFamily: "'Segoe UI', Roboto, sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "20px" },
  mainTitle: { margin: 0, color: "#1e293b", fontSize: "28px", fontWeight: "800" },
  searchWrapper: { position: "relative", width: "400px" },
  searchIcon: { position: "absolute", left: "12px", top: "10px", color: "#94a3b8" },
  searchBar: { width: "100%", padding: "12px 12px 12px 40px", borderRadius: "12px", border: "1px solid #cbd5e1", outline: "none", boxShadow: "0 2px 4px rgba(0,0,0,0.02)", fontSize: "14px" },
  layout: { display: "flex", gap: "30px" },
  sidebar: { width: "350px", display: "flex", flexDirection: "column", gap: "20px" },
  content: { flex: 1 },
  card: { background: "#fff", padding: "20px", borderRadius: "16px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" },
  cardTitle: { fontSize: "16px", marginBottom: "15px", color: "#1e293b", fontWeight: "700" },
  statRow: { display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.1)" },
  badge: { background: "#3b82f6", padding: "2px 10px", borderRadius: "20px", fontWeight: "bold" },
  revenueText: { fontSize: "18px", color: "#22c55e", fontWeight: "800" },
  clearBtn: { width: "100%", marginTop: "15px", padding: "10px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
  bookingCard: { background: "#fff", padding: "24px", borderRadius: "20px", marginBottom: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.03)", transition: "transform 0.2s" },
  cardMain: { display: "flex", gap: "20px" },
  carThumbnail: { width: "180px", height: "120px", borderRadius: "14px", objectFit: "cover", background: "#f8fafc" },
  carDetails: { flex: 1 },
  topRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  carTitle: { margin: 0, fontSize: "20px", color: "#1e293b" },
  subInfo: { margin: "4px 0", color: "#64748b", fontSize: "14px" },
  divider: { height: "1px", background: "#f1f5f9", margin: "15px 0" },
  footerRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  dateRange: { margin: 0, fontSize: "14px", color: "#1e293b", fontWeight: "600" },
  userLink: { margin: "5px 0 0 0", fontSize: "13px", color: "#3b82f6", cursor: "pointer" },
  priceContainer: { textAlign: "right", display: "flex", flexDirection: "column" },
  priceLabel: { fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" },
  priceValue: { fontSize: "22px", fontWeight: "900", color: "#1e293b" },
  modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modalBox: { background: "#fff", padding: "30px", borderRadius: "24px", width: "400px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" },
  modalHeader: { display: "flex", justifyContent: "space-between", marginBottom: "20px" },
  modalCloseX: { background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#94a3b8" },
  modalAvatar: { width: "90px", height: "90px", borderRadius: "50%", marginBottom: "12px", border: "4px solid #f1f5f9" },
  modalGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "20px" },
  modalItem: { background: "#f8fafc", padding: "12px", borderRadius: "12px", fontSize: "13px" },
  modalBtn: { width: "100%", marginTop: "25px", padding: "12px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "bold", cursor: "pointer" },
  emptyState: { textAlign: "center", padding: "40px", color: "#94a3b8", background: "#fff", borderRadius: "16px" }
};

export default AdminBookings;