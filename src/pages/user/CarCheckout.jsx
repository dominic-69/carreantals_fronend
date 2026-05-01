/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../services/api";

function CarCheckout() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return (
    <div style={styles.errorPage}>
      <h2>No booking data found ❌</h2>
      <button onClick={() => navigate("/")} style={styles.backBtn}>Back to Home</button>
    </div>
  );

  const { car, startDate, endDate } = state;
  const token = localStorage.getItem("access");

  const [agree, setAgree] = useState(false);
  const [pickupTime, setPickupTime] = useState(""); 
  const [returnTime, setReturnTime] = useState("");

  const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) || 1;
  const total = days * car.price;
  const advance = total * 0.4;
  const remaining = total - advance;

  const handleConfirmBooking = async () => {
    if (!pickupTime || !returnTime) {
      alert("Please select pickup and return time 🕒");
      return;
    }
    if (!agree) {
      alert("Please accept Terms & Conditions ⚠️");
      return;
    }

    try {
      const res = await API.post(
        "rental/book/",
        {
          car_id: car.id,
          start_date: startDate,
          end_date: endDate,
          pickup_time: pickupTime,
          return_time: returnTime,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { booking_id, amount } = res.data;

      const options = {
        key: "rzp_test_Sg7JEq3JdVsjLK",
        amount: amount * 100,
        currency: "INR",
        name: "AutoDrive Premium",
        description: `Booking for ${car.title}`,
        handler: async function () {
          await API.post(
            "rental/payment-success/",
            { booking_id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          navigate("/booking-success");
        },
        theme: { color: "#6366f1" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(err.response?.data?.error || "Booking failed ❌");
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <div style={styles.headerArea}>
          <h1 style={styles.mainTitle}>Finalize Your <span style={{color: '#6366f1'}}>Reservation</span></h1>
          <p style={styles.subtitle}>Review your fleet selection and schedule</p>
        </div>

        <div style={styles.layout}>
          {/* LEFT: CAR & SELLER DETAILS */}
          <div style={styles.leftCol}>
            <div style={styles.glassCard}>
              <div style={styles.imageGrid}>
                {car.images?.length > 0 ? (
                  <>
                    <img src={car.images[0].image} alt="main" style={styles.mainImg} />
                    <div style={styles.sideImgs}>
                      {car.images.slice(1, 3).map((img) => (
                        <img key={img.id} src={img.image} alt="thumb" style={styles.thumbImg} />
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={styles.imgPlaceholder}>🚘</div>
                )}
              </div>
              
              <div style={styles.carInfo}>
                <h2 style={styles.carName}>{car.title}</h2>
                <div style={styles.locationTag}>📍 {car.location}</div>
                <p style={styles.description}>{car.description}</p>
              </div>
            </div>

            <div style={styles.glassCard}>
              <h3 style={styles.sectionTitle}>Authorized Seller</h3>
              <div style={styles.sellerRow}>
                <div style={styles.sellerAvatar}>{car.seller?.name?.[0]}</div>
                <div>
                  <div style={styles.sellerName}>{car.seller?.name}</div>
                  <div style={styles.sellerEmail}>{car.seller?.email}</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: STICKY SUMMARY & TIME PICKERS */}
          <div style={styles.rightCol}>
            <div style={styles.summaryBox}>
              <h3 style={styles.sumTitle}>Booking Summary</h3>
              
              <div style={styles.dateBlock}>
                <div style={styles.dateItem}>
                  <label style={styles.tinyLabel}>PICKUP DATE</label>
                  <div style={styles.dateVal}>{startDate}</div>
                </div>
                <div style={styles.dateItem}>
                  <label style={styles.tinyLabel}>RETURN DATE</label>
                  <div style={styles.dateVal}>{endDate}</div>
                </div>
              </div>

              <div style={styles.timeSection}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Pickup Time</label>
                  <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} style={styles.timeInput} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Return Time</label>
                  <input type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} style={styles.timeInput} />
                </div>
              </div>

              <div style={styles.divider} />

              <div style={styles.priceRow}>
                <span>Daily Rate x {days} days</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <div style={styles.priceRow}>
                <span style={{color: '#10b981', fontWeight: '600'}}>Advance to Pay (40%)</span>
                <span style={{color: '#10b981', fontWeight: '700'}}>₹{advance.toLocaleString()}</span>
              </div>
              <div style={styles.priceRow}>
                <span style={{color: '#94a3b8', fontSize: '13px'}}>Remaining Balance</span>
                <span style={{color: '#94a3b8', fontSize: '13px'}}>₹{remaining.toLocaleString()}</span>
              </div>

              <div style={styles.totalRow}>
                <div style={styles.finalTotal}>₹{total.toLocaleString()}</div>
                <div style={styles.totalLabel}>Total Value</div>
              </div>

              <label style={styles.checkboxLabel}>
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} style={styles.checkbox} />
                I accept the Rental Terms & Policy
              </label>

              <button onClick={handleConfirmBooking} disabled={!agree} style={{ ...styles.payBtn, opacity: agree ? 1 : 0.6 }}>
                Secure Checkout →
              </button>
              
              <div style={styles.secureBadge}>🔒 256-bit SSL Secure Payment</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: { minHeight: "100vh", background: "#f1f5f9", fontFamily: "'Inter', sans-serif", padding: "60px 20px" },
  container: { maxWidth: "1100px", margin: "0 auto" },
  headerArea: { marginBottom: "40px" },
  mainTitle: { fontSize: "32px", fontWeight: "900", color: "#1e293b", margin: "0 0 8px 0" },
  subtitle: { color: "#64748b", fontSize: "16px" },
  layout: { display: "grid", gridTemplateColumns: "1fr 400px", gap: "30px", alignItems: "start" },
  leftCol: { display: "flex", flexDirection: "column", gap: "25px" },
  glassCard: { background: "#fff", borderRadius: "24px", padding: "25px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" },
  imageGrid: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px", marginBottom: "20px" },
  mainImg: { width: "100%", height: "320px", objectFit: "cover", borderRadius: "18px" },
  sideImgs: { display: "flex", flexDirection: "column", gap: "12px" },
  thumbImg: { width: "100%", height: "154px", objectFit: "cover", borderRadius: "16px" },
  imgPlaceholder: { height: "320px", background: "#f1f5f9", borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" },
  carName: { fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: "0 0 5px 0" },
  locationTag: { color: "#6366f1", fontWeight: "600", fontSize: "14px", marginBottom: "15px" },
  description: { color: "#475569", lineHeight: "1.6", fontSize: "15px" },
  sectionTitle: { fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "15px", textTransform: "uppercase", letterSpacing: "1px" },
  sellerRow: { display: "flex", alignItems: "center", gap: "15px" },
  sellerAvatar: { width: "45px", height: "45px", background: "#e2e8f0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#6366f1" },
  sellerName: { fontWeight: "700", color: "#1e293b" },
  sellerEmail: { color: "#64748b", fontSize: "13px" },
  rightCol: { position: "sticky", top: "100px" },
  summaryBox: { background: "#1e293b", borderRadius: "24px", padding: "30px", color: "#fff", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" },
  sumTitle: { fontSize: "20px", fontWeight: "700", marginBottom: "25px" },
  dateBlock: { display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: "16px", padding: "15px", marginBottom: "20px" },
  dateItem: { flex: 1, textAlign: "center" },
  tinyLabel: { fontSize: "10px", color: "#94a3b8", fontWeight: "800", display: "block", marginBottom: "4px" },
  dateVal: { fontSize: "14px", fontWeight: "600" },
  timeSection: { display: "flex", gap: "15px", marginBottom: "20px" },
  inputGroup: { flex: 1 },
  label: { fontSize: "12px", color: "#94a3b8", fontWeight: "600", display: "block", marginBottom: "5px" },
  timeInput: { width: "100%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "10px", color: "#fff", outline: "none" },
  divider: { height: "1px", background: "rgba(255,255,255,0.1)", margin: "20px 0" },
  priceRow: { display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "14px", color: "#cbd5e1" },
  totalRow: { textAlign: "right", marginTop: "25px" },
  finalTotal: { fontSize: "32px", fontWeight: "900" },
  totalLabel: { fontSize: "12px", color: "#94a3b8", textTransform: "uppercase" },
  checkboxLabel: { display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#cbd5e1", marginTop: "20px", cursor: "pointer" },
  checkbox: { width: "16px", height: "16px" },
  payBtn: { width: "100%", background: "#6366f1", color: "#fff", border: "none", borderRadius: "14px", padding: "16px", fontWeight: "700", fontSize: "16px", marginTop: "20px", cursor: "pointer", transition: "0.3s" },
  secureBadge: { textAlign: "center", fontSize: "11px", color: "#64748b", marginTop: "15px" },
  errorPage: { height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" },
  backBtn: { padding: "10px 20px", background: "#6366f1", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }
};

export default CarCheckout;