/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [now, setNow] = useState(new Date());
  const token = localStorage.getItem("access");
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const res = await API.get("rental/my-bookings/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔥 LIVE CLOCK
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const cancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel?")) return;
    try {
      await API.post(`rental/cancel/${id}/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBookings();
    } catch {
      alert("Cancel failed ❌");
    }
  };

  const returnCar = async (id) => {
    try {
      const res = await API.post(`rental/return/${id}/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(`Returned Successfully ✅ Fine: ₹${res.data.fine}`);
      fetchBookings();
    } catch {
      alert("Return failed ❌");
    }
  };

  const formatTime = (ms) => {
    if (ms < 0) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div style={styles.pageWrapper}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
          .booking-card { transition: all 0.3s ease; font-family: 'Plus Jakarta Sans', sans-serif; }
          .booking-card:hover { transform: translateY(-5px); box-shadow: 0 12px 30px rgba(0,0,0,0.1) !important; }
          .btn-cancel { background: #fff; border: 1px solid #fee2e2; color: #ef4444; }
          .btn-cancel:hover { background: #fee2e2; }
          .btn-return { background: #1e293b; color: #fff; border: none; }
          .btn-return:hover { background: #0f172a; }
        `}
      </style>

      {/* 🔝 NAVBAR */}
      <header style={styles.header}>
        <div onClick={() => navigate("/")} style={styles.backBtn}>
          <span style={{fontSize: '18px'}}>←</span> Back to Home
        </div>
        <h1 style={styles.mainTitle}>My <span style={{ color: '#6366f1' }}>Reservations</span></h1>
        <div style={styles.clockBadge}>{now.toLocaleTimeString()}</div>
      </header>

      <div style={styles.container}>
        {bookings.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{fontSize: '50px', marginBottom: '15px'}}>🚗</div>
            <p style={{color: '#64748b', fontSize: '18px'}}>Your garage is empty.</p>
            <button onClick={() => navigate("/")} style={styles.exploreBtn}>Find a Ride</button>
          </div>
        ) : (
          bookings.map((b) => {
            const isCompleted = b.status === "completed" || b.status === "returned";

            let timeText = "00:00:00";
            let isLate = false;
            let isWarning = false;
            let tripStatus = "Awaiting";
            let progress = 0;
            let statusColor = "#6366f1";

            const pickup = b.pickup_time || "09:00";
            const ret = b.return_time || "18:00";
            const startDateTime = new Date(`${b.start_date}T${pickup}`);
            const returnDateTime = new Date(`${b.end_date}T${ret}`);

            if (isCompleted) {
              tripStatus = "Completed ✅";
              statusColor = "#10b981";
              timeText = "Trip Finished";
            }
            else if (now < startDateTime) {
              tripStatus = "Upcoming ⏳";
              timeText = "Ready Soon";
            }
            else if (now >= startDateTime && now <= returnDateTime) {
              tripStatus = "Active 🚀";
              statusColor = "#10b981";
              const diff = returnDateTime - now;
              timeText = formatTime(diff);
              if (diff < 30 * 60 * 1000) isWarning = true;
              const total = returnDateTime - startDateTime;
              const used = now - startDateTime;
              progress = Math.min((used / total) * 100, 100);
            }
            else {
              tripStatus = "Overdue ⛔";
              statusColor = "#ef4444";
              isLate = true;
              const lateMs = Math.abs(now - returnDateTime);
              timeText = formatTime(lateMs);
            }

            const canCancel = now < startDateTime && !isCompleted;
            const canReturn = now >= startDateTime && !isCompleted;

            return (
              <div key={b.id} className="booking-card" style={{ 
                ...styles.bookingCard, 
                borderColor: isLate ? '#fee2e2' : isWarning ? '#ffedd5' : '#f1f5f9' 
              }}>
                {/* LEFT: IMAGE SECTION */}
                <div style={styles.imageSection}>
                  <img src={b.car?.image || "/car-placeholder.png"} style={styles.carImg} alt="car" />
                  <div style={{ ...styles.statusBadge, backgroundColor: statusColor }}>{tripStatus}</div>
                </div>

                {/* MIDDLE: INFO SECTION */}
                <div style={styles.infoSection}>
                  <h3 style={styles.carTitle}>{b.car?.title || "Premium Vehicle"}</h3>
                  <div style={styles.dateMeta}>
                    <div style={styles.metaItem}>
                        <span style={styles.metaLabel}>FROM</span>
                        <span style={styles.metaVal}>{b.start_date} @ {pickup}</span>
                    </div>
                    <div style={styles.metaItem}>
                        <span style={styles.metaLabel}>UNTIL</span>
                        <span style={styles.metaVal}>{b.end_date} @ {ret}</span>
                    </div>
                  </div>

                  {/* 🔥 TIMER SECTION (CONDITIONAL) */}
                  {!isCompleted ? (
                    <div style={{ ...styles.timerBox, background: isLate ? '#fff1f2' : '#f8fafc' }}>
                      <span style={styles.timerLabel}>{isLate ? "LATE BY" : "TIME REMAINING"}</span>
                      <div style={{ ...styles.timerVal, color: isLate ? '#ef4444' : '#1e293b' }}>
                        {isLate && "+ "}{timeText}
                      </div>
                      {!isLate && now >= startDateTime && (
                        <div style={styles.progressTrack}>
                          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={styles.completedBanner}>
                       <span style={{marginRight: '8px'}}>🏁</span> This rental has been safely returned.
                    </div>
                  )}

                  {isWarning && !isCompleted && (
                    <div style={styles.warningMsg}>⚠️ Approaching return deadline!</div>
                  )}
                </div>

                {/* RIGHT: PRICING & ACTIONS */}
                <div style={styles.actionSection}>
                  <div style={styles.priceContainer}>
                    <span style={styles.priceLabel}>TOTAL AMOUNT</span>
                    <h2 style={styles.priceVal}>₹{(b.total_price ?? 0).toLocaleString()}</h2>
                  </div>

                  {(b.fine_amount > 0 || (isLate && !isCompleted)) && (
                    <div style={styles.fineBadge}>
                      FINE: ₹{b.fine_amount || "Calculating..."}
                    </div>
                  )}

                  <div style={styles.btnRow}>
                    {canCancel && b.status !== "cancelled" && (
                      <button onClick={() => cancelBooking(b.id)} className="btn-cancel" style={styles.actionBtn}>Cancel</button>
                    )}
                    {b.status === "confirmed" && canReturn && (
                      <button onClick={() => returnCar(b.id)} className="btn-return" style={styles.actionBtn}>Complete Return</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: { background: "#f8fafc", minHeight: "100vh" },
  header: { background: "#fff", padding: "15px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", position: 'sticky', top: 0, zIndex: 10 },
  backBtn: { cursor: "pointer", color: "#64748b", fontWeight: "700", display: "flex", gap: "8px", alignItems: 'center' },
  mainTitle: { fontSize: "22px", fontWeight: "800", margin: 0, color: "#1e293b" },
  clockBadge: { background: "#f1f5f9", padding: "6px 14px", borderRadius: "8px", fontWeight: "bold", fontSize: "14px", color: "#6366f1" },
  container: { maxWidth: "1000px", margin: "40px auto", padding: "0 20px" },
  
  bookingCard: { display: "flex", background: "#fff", borderRadius: "24px", border: "1px solid #e2e8f0", marginBottom: "20px", overflow: 'hidden', padding: '20px', gap: '25px' },
  imageSection: { width: "180px", position: "relative" },
  carImg: { width: "100%", height: "120px", objectFit: "cover", borderRadius: "16px" },
  statusBadge: { position: "absolute", top: "-10px", left: "-10px", color: "#fff", padding: "4px 10px", borderRadius: "8px", fontSize: "10px", fontWeight: "800", textTransform: 'uppercase' },
  
  infoSection: { flex: 2 },
  carTitle: { fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: "0 0 15px 0" },
  dateMeta: { display: "flex", gap: "20px", marginBottom: "15px" },
  metaItem: { display: "flex", flexDirection: "column" },
  metaLabel: { fontSize: "10px", fontWeight: "800", color: "#94a3b8" },
  metaVal: { fontSize: "13px", fontWeight: "600", color: "#1e293b" },
  
  timerBox: { padding: "12px", borderRadius: "12px" },
  timerLabel: { fontSize: "9px", fontWeight: "800", color: "#94a3b8", display: 'block', marginBottom: '4px' },
  timerVal: { fontSize: "22px", fontWeight: "900", fontFamily: 'monospace' },
  progressTrack: { height: "5px", background: "#e2e8f0", borderRadius: "10px", marginTop: "8px", overflow: "hidden" },
  progressFill: { height: "100%", background: "#6366f1", borderRadius: "10px", transition: 'width 1s linear' },
  
  completedBanner: { background: '#f0fdf4', color: '#16a34a', padding: '12px', borderRadius: '12px', fontWeight: '700', fontSize: '14px', border: '1px solid #dcfce7' },
  warningMsg: { color: "#ea580c", fontWeight: "700", fontSize: "12px", marginTop: "8px" },

  actionSection: { flex: 1, textAlign: "right", display: "flex", flexDirection: "column", justifyContent: "space-between" },
  priceContainer: { display: "flex", flexDirection: "column" },
  priceLabel: { fontSize: "10px", fontWeight: "800", color: "#94a3b8" },
  priceVal: { margin: 0, color: "#1e293b" },
  fineBadge: { background: "#fee2e2", color: "#ef4444", padding: "6px", borderRadius: "8px", fontSize: "11px", fontWeight: "800", marginTop: '8px' },
  
  btnRow: { display: "flex", flexDirection: "column", gap: "8px", marginTop: '15px' },
  actionBtn: { padding: "10px", borderRadius: "10px", fontWeight: "700", cursor: "pointer", fontSize: "14px", transition: 'all 0.2s' },
  
  emptyState: { textAlign: "center", padding: "60px 0" },
  exploreBtn: { marginTop: "20px", padding: "12px 30px", background: "#6366f1", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "700", cursor: "pointer" }
};

export default MyBookings;