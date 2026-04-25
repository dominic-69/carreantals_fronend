import React, { useEffect, useState } from "react";
import API from "../../services/api";
import AdminSidebar from "../components/AdminSidebar";

function AdminCarApproval() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingCars();
  }, []);

  const fetchPendingCars = async () => {
    try {
      const res = await API.get("cars/admin/pending/");
      setCars(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await API.post(`cars/admin/approve/${id}/`, { action: action });
      // Using a modern subtle alert feel
      fetchPendingCars();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={styles.layout}>
      {/* 1. Sidebar remains fixed on the left */}
      <AdminSidebar />

      {/* 2. Scrollable Main Content */}
      <div style={styles.mainContent}>
        
        {/* CSS for Premium Hover States */}
        <style>
          {`
            .approval-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
            .approval-card:hover { 
              transform: translateY(-5px); 
              box-shadow: 0 20px 40px rgba(0,0,0,0.08);
              border-color: #6366f1 !important;
            }
            .image-thumb { transition: transform 0.3s ease; cursor: zoom-in; }
            .image-thumb:hover { transform: scale(1.05); }
            ::-webkit-scrollbar { width: 6px; }
            ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
          `}
        </style>

        <header style={styles.header}>
          <div>
            <h2 style={styles.title}>Vehicle Verification</h2>
            <p style={styles.subtitle}>Audit pending listings for quality and authenticity</p>
          </div>
          <div style={styles.counterBadge}>
            {cars.length} REQUESTS PENDING
          </div>
        </header>

        {loading ? (
          <div style={styles.loader}>Syncing with Registry...</div>
        ) : cars.length === 0 ? (
          <div style={styles.emptyContainer}>
            <div style={{ fontSize: "60px", marginBottom: "20px" }}>🛡️</div>
            <h3 style={{ color: "#1e293b", fontSize: "24px" }}>Garage is Clean</h3>
            <p style={{ color: "#64748b" }}>No vehicles currently requiring verification.</p>
          </div>
        ) : (
          <div style={styles.cardGrid}>
            {cars.map((car) => (
              <div key={car.id} className="approval-card" style={styles.card}>
                
                {/* Header: Model & Price */}
                <div style={styles.cardTop}>
                  <div>
                    <span style={styles.refCode}>REF: #CAR-{car.id}</span>
                    <h3 style={styles.carName}>{car.title}</h3>
                  </div>
                  <div style={styles.priceTag}>₹{car.price.toLocaleString()}</div>
                </div>

                {/* Specs Grid */}
                <div style={styles.specBox}>
                  <div style={styles.specItem}>
                    <label style={styles.label}>OWNER</label>
                    <span style={styles.value}>{car.owner}</span>
                  </div>
                  <div style={styles.specItem}>
                    <label style={styles.label}>FUEL</label>
                    <span style={styles.value}>{car.fuel_type}</span>
                  </div>
                  <div style={styles.specItem}>
                    <label style={styles.label}>REGISTRATION</label>
                    <span style={styles.value}>{car.registration_number || "PENDING"}</span>
                  </div>
                  <div style={styles.specItem}>
                    <label style={styles.label}>LOCATION</label>
                    <span style={styles.value}>{car.location || "N/A"}</span>
                  </div>
                </div>

                {/* Image Gallery */}
                <div style={styles.gallery}>
                  {car.images?.map((img) => (
                    <img
                      key={img.id}
                      src={img.image}
                      alt="car"
                      className="image-thumb"
                      style={styles.thumb}
                    />
                  ))}
                  {(!car.images || car.images.length === 0) && (
                    <div style={styles.noImage}>No images provided</div>
                  )}
                </div>

                {/* Actions */}
                <div style={styles.footer}>
                  <button
                    onClick={() => handleAction(car.id, "reject")}
                    style={styles.rejectBtn}
                  >
                    Flag as Inaccurate
                  </button>
                  <button
                    onClick={() => handleAction(car.id, "approve")}
                    style={styles.approveBtn}
                  >
                    Verify & Publish ✅
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  layout: {
    display: "flex",
    height: "100vh",
    overflow: "hidden",
    background: "#f8fafc",
  },
  mainContent: {
    flex: 1,
    overflowY: "auto",
    padding: "50px",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: "25px",
  },
  title: { fontSize: "32px", fontWeight: "900", margin: 0, color: "#0f172a" },
  subtitle: { margin: "5px 0 0 0", color: "#64748b", fontSize: "16px" },
  counterBadge: {
    background: "#6366f1",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1px",
  },
  cardGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "25px",
    maxWidth: "1000px",
  },
  card: {
    background: "#fff",
    borderRadius: "24px",
    padding: "32px",
    border: "1px solid #f1f5f9",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.02)",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
  },
  refCode: { fontSize: "11px", color: "#94a3b8", fontWeight: "700" },
  carName: { margin: "5px 0 0 0", fontSize: "24px", fontWeight: "800", color: "#1e293b" },
  priceTag: { fontSize: "22px", fontWeight: "900", color: "#6366f1" },
  specBox: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    background: "#f8fafc",
    padding: "20px",
    borderRadius: "16px",
    gap: "15px",
  },
  label: { display: "block", fontSize: "10px", fontWeight: "800", color: "#94a3b8", marginBottom: "4px" },
  value: { fontSize: "14px", fontWeight: "700", color: "#334155" },
  gallery: {
    display: "flex",
    gap: "15px",
    overflowX: "auto",
    padding: "10px 0",
  },
  thumb: {
    width: "180px",
    height: "110px",
    objectFit: "cover",
    borderRadius: "14px",
    border: "2px solid #fff",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
  },
  noImage: { color: "#94a3b8", fontStyle: "italic", padding: "20px" },
  footer: {
    marginTop: "20px",
    paddingTop: "20px",
    borderTop: "1px solid #f1f5f9",
    display: "flex",
    justifyContent: "flex-end",
    gap: "15px",
  },
  approveBtn: {
    padding: "14px 28px",
    background: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 10px 20px rgba(99, 102, 241, 0.2)",
  },
  rejectBtn: {
    padding: "14px 28px",
    background: "transparent",
    color: "#ef4444",
    border: "1px solid #fee2e2",
    borderRadius: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },
  loader: { textAlign: "center", padding: "100px", color: "#6366f1", fontWeight: "700" },
  emptyContainer: { textAlign: "center", padding: "120px 0" }
};

export default AdminCarApproval;