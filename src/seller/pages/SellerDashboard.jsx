import React, { useEffect, useState } from "react";
import SellerSidebar from "../components/SellerSidebar";
import { getMyCars } from "../../services/api";

const SellerDashboard = () => {
  const [carCount, setCarCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const res = await getMyCars();
      setCarCount(res.data.length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- Variety Dashboard Styles ---
  const containerStyle = {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f4f7fa",
    fontFamily: "'Poppins', sans-serif",
  };

  const mainContent = {
    flex: 1,
    padding: "40px",
    position: "relative",
    overflow: "hidden",
  };

  const statsGrid = {
    display: "flex",
    gap: "25px",
    marginTop: "30px",
    flexWrap: "wrap",
  };

  const statCard = (index, color) => ({
    background: "#fff",
    padding: "30px",
    borderRadius: "24px",
    width: "240px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.03)",
    border: `1px solid #f0f0f0`,
    borderLeft: `6px solid ${color}`,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    animation: `popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards ${index * 0.2}s`,
    opacity: 0,
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  });

  return (
    <div style={containerStyle}>
      <SellerSidebar />

      <style>
        {`
          @keyframes popIn {
            from { opacity: 0; transform: scale(0.8) translateY(20px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes floatIcon {
            0% { transform: translateY(0) rotate(0); }
            50% { transform: translateY(-15px) rotate(5deg); }
            100% { transform: translateY(0) rotate(0); }
          }
          @keyframes glowPulse {
            0% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.1); opacity: 0.5; }
            100% { transform: scale(1); opacity: 0.3; }
          }
          .dashboard-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
          }
        `}
      </style>

      <div style={mainContent}>
        {/* Animated Background Decor */}
        <div style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "radial-gradient(circle, #3b82f6, transparent)",
          animation: "glowPulse 4s infinite",
          zIndex: 0
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div style={{ fontSize: "40px", animation: "floatIcon 3s ease-in-out infinite" }}>📊</div>
            <div>
              <h1 style={{ margin: 0, color: "#1e293b", fontSize: "32px" }}>Seller Overview</h1>
              <p style={{ color: "#64748b", margin: "5px 0 0 0" }}>Welcome back! Here is what's happening today.</p>
            </div>
          </div>

          <div style={statsGrid}>
            {/* My Cars Card */}
            <div className="dashboard-card" style={statCard(1, "#3b82f6")}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#64748b" }}>MY FLEET</span>
                <span style={{ fontSize: "20px" }}>🚗</span>
              </div>
              <h2 style={{ margin: 0, fontSize: "36px", color: "#1e293b" }}>
                {loading ? "..." : carCount}
              </h2>
              <p style={{ fontSize: "12px", color: "#10b981", margin: 0 }}>Active Listings</p>
            </div>

            {/* Bookings Card */}
            <div className="dashboard-card" style={statCard(2, "#8b5cf6")}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#64748b" }}>BOOKINGS</span>
                <span style={{ fontSize: "20px" }}>📅</span>
              </div>
              <h2 style={{ margin: 0, fontSize: "36px", color: "#1e293b" }}>0</h2>
              <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>Pending Approval</p>
            </div>

            {/* Earnings Card (Added for Standard Dashboard Variety) */}
            <div className="dashboard-card" style={statCard(3, "#10b981")}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#64748b" }}>REVENUE</span>
                <span style={{ fontSize: "20px" }}>💰</span>
              </div>
              <h2 style={{ margin: 0, fontSize: "36px", color: "#1e293b" }}>₹ 0</h2>
              <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>This Month</p>
            </div>
          </div>

          {/* Bottom Visual Section */}
          <div style={{ 
            marginTop: "40px", 
            padding: "30px", 
            background: "linear-gradient(135deg, #1e293b, #334155)", 
            borderRadius: "24px",
            color: "#fff",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            animation: "popIn 0.8s ease forwards 0.6s",
            opacity: 0
          }}>
            <h3 style={{ margin: 0 }}>Quick Tips</h3>
            <p style={{ opacity: 0.8, fontSize: "14px", maxWidth: "500px" }}>
              High-quality photos increase booking chances by 40%. Head over to <b>My Cars</b> to update your inventory with recent shots!
            </p>
            <button style={{ 
              marginTop: "15px", 
              padding: "10px 20px", 
              borderRadius: "10px", 
              border: "none", 
              backgroundColor: "#3b82f6", 
              color: "#fff", 
              fontWeight: "600",
              cursor: "pointer"
            }}>
              View Insights
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;