/* eslint-disable no-undef */
import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ added
import AdminSidebar from "../components/AdminSidebar";

const AdminDashboard = () => {
  const navigate = useNavigate(); // ✅ added

  // --- Matte Premium Admin Styles ---
  const containerStyle = {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    fontFamily: "'Inter', sans-serif",
    position: "relative",
    overflow: "hidden",
  };

  const mainContent = {
    flex: 1,
    padding: "40px",
    zIndex: 2,
  };

  const statsGrid = {
    display: "flex",
    gap: "25px",
    marginTop: "40px",
    flexWrap: "wrap",
  };

  const statCard = (index, accentColor) => ({
    background: "#ffffff",
    padding: "25px",
    borderRadius: "20px",
    width: "240px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.03)",
    border: "1px solid #f1f5f9",
    borderTop: `5px solid ${accentColor}`,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    animation: `fadeInUp 0.6s ease-out forwards ${index * 0.15}s`,
    opacity: 0,
    transition: "transform 0.3s ease",
  });

  return (
    <div style={containerStyle}>
      <AdminSidebar />

      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes orbMove {
            0% { transform: translate(0, 0); }
            50% { transform: translate(-30px, 40px); }
            100% { transform: translate(0, 0); }
          }
          .card-hover:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.06);
          }
          .bg-orb {
            position: absolute; width: 450px; height: 450px;
            border-radius: 50%; filter: blur(100px);
            z-index: 1; animation: orbMove 10s infinite ease-in-out;
            opacity: 0.4;
          }
        `}
      </style>

      <div className="bg-orb" style={{ background: "#e0f2fe", top: "-50px", right: "10%" }} />
      <div className="bg-orb" style={{ background: "#fef3c7", bottom: "10%", left: "5%", animationDelay: "2s" }} />

      <div style={mainContent}>
        <header style={{ marginBottom: "10px" }}>
          <h1 style={{ margin: 0, color: "#0f172a", fontSize: "30px", fontWeight: "800" }}>
            Admin Dashboard
          </h1>
          <p style={{ color: "#64748b", margin: "5px 0 0 0" }}>
            Overview of your platform's current performance.
          </p>
        </header>

        <div style={statsGrid}>
          
          {/* USERS */}
          <div className="card-hover" style={statCard(1, "#3b82f6")}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#94a3b8" }}>USERS</span>
              <span>👥</span>
            </div>
            <h2 style={{ margin: "5px 0", fontSize: "38px" }}>12</h2>
            <div style={{ fontSize: "12px", color: "#10b981" }}>● Registered Accounts</div>
          </div>

          {/* CARS */}
          <div className="card-hover" style={statCard(2, "#f59e0b")}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#94a3b8" }}>LISTINGS</span>
              <span>🚗</span>
            </div>
            <h2 style={{ margin: "5px 0", fontSize: "38px" }}>8</h2>
            <div style={{ fontSize: "12px", color: "#64748b" }}>● Active Vehicles</div>
          </div>

          {/* BOOKINGS */}
          <div className="card-hover" style={statCard(3, "#10b981")}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#94a3b8" }}>REVENUE</span>
              <span>📦</span>
            </div>
            <h2 style={{ margin: "5px 0", fontSize: "38px" }}>5</h2>
            <div style={{ fontSize: "12px", color: "#3b82f6" }}>● Total Bookings</div>
          </div>

          {/* 🔥 NEW: CAR APPROVAL CARD */}
          <div
            className="card-hover"
            style={statCard(4, "#ef4444")}
            onClick={() => navigate("/admin/car-approvals")}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#94a3b8" }}>
                APPROVALS
              </span>
              <span>🛠️</span>
            </div>
            <h2 style={{ margin: "5px 0", fontSize: "20px" }}>
              Car Approvals
            </h2>
            <div style={{ fontSize: "12px", color: "#ef4444", fontWeight: "600" }}>
              ● Review Pending Cars
            </div>
          </div>

        </div>

        {/* STATUS PANEL */}
        <div style={{
          marginTop: "40px",
          background: "#1e293b",
          padding: "30px",
          borderRadius: "24px",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          animation: "fadeInUp 0.8s ease-out forwards 0.5s",
          opacity: 0
        }}>
          <div>
            <h3 style={{ margin: 0 }}>System Performance</h3>
            <p style={{ opacity: 0.7, fontSize: "14px" }}>
              The server is running optimally. No critical errors detected.
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", background: "rgba(255,255,255,0.1)", padding: "10px 20px", borderRadius: "12px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10b981" }}></div>
            <span>Online</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;