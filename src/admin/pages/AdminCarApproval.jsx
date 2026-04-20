/* eslint-disable no-dupe-keys */
import React, { useEffect, useState } from "react";
import API from "../../services/api";

function AdminCarApproval() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetchPendingCars();
  }, []);

  const fetchPendingCars = async () => {
    try {
      const res = await API.get("cars/admin/pending/");
      setCars(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await API.post(`cars/admin/approve/${id}/`, {
        action: action,
      });
      alert(`Car ${action}d ✅`);
      fetchPendingCars();
    } catch (err) {
      console.log(err);
      alert("Error ❌");
    }
  };

  // --- Inline Styles ---
  const containerStyle = {
    padding: "40px",
    background: "#f1f5f9",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
  };

  const headerStyle = {
    maxWidth: "1000px",
    margin: "0 auto 30px auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderBottom: "2px solid #e2e8f0",
    paddingBottom: "15px",
  };

  const cardStyle = {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "20px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0",
    maxWidth: "1000px",
    margin: "0 auto 20px auto",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    transition: "transform 0.2s ease",
  };

  const infoSection = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "20px",
    background: "#f8fafc",
    padding: "15px",
    borderRadius: "12px",
  };

  const labelStyle = {
    fontSize: "11px",
    fontWeight: "800",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "4px",
  };

  const valueStyle = {
    fontSize: "15px",
    fontWeight: "700",
    color: "#334155",
  };

  const btnStyle = (type) => ({
    padding: "12px 24px",
    borderRadius: "10px",
    border: "none",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    background: type === "approve" ? "#6366f1" : "#fff",
    color: type === "approve" ? "#fff" : "#ef4444",
    border: type === "approve" ? "none" : "1px solid #fee2e2",
    boxShadow: type === "approve" ? "0 4px 12px rgba(99, 102, 241, 0.3)" : "none",
  });

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <h2 style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: "#0f172a" }}>Car Approvals</h2>
          <p style={{ margin: "5px 0 0 0", color: "#64748b", fontSize: "15px" }}>Review and verify vehicle listings</p>
        </div>
        <div style={{ textAlign: "right", color: "#6366f1", fontWeight: "800" }}>
          {cars.length} Pending Requests
        </div>
      </div>

      {cars.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "100px", color: "#94a3b8" }}>
          <div style={{ fontSize: "50px" }}>🏁</div>
          <h3>All caught up!</h3>
          <p>No cars waiting for approval.</p>
        </div>
      ) : (
        <div>
          {cars.map((car) => (
            <div key={car.id} style={cardStyle}>
              {/* Top Row: Title & Price */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, fontSize: "22px", color: "#1e293b" }}>{car.title}</h3>
                <span style={{ fontSize: "20px", fontWeight: "800", color: "#6366f1" }}>₹{car.price}</span>
              </div>

              {/* Middle Row: Specs */}
              <div style={infoSection}>
                <div>
                  <div style={labelStyle}>Owner</div>
                  <div style={valueStyle}>{car.owner}</div>
                </div>
                <div>
                  <div style={labelStyle}>Fuel Type</div>
                  <div style={valueStyle}>{car.fuel_type}</div>
                </div>
                <div>
                  <div style={labelStyle}>Location</div>
                  <div style={valueStyle}>{car.location || "N/A"}</div>
                </div>
                <div>
                  <div style={labelStyle}>Reg. No</div>
                  <div style={valueStyle}>{car.registration_number || "N/A"}</div>
                </div>
              </div>

              {/* Images Row */}
              <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "5px" }}>
                {car.images?.map((img) => (
                  <img
                    key={img.id}
                    src={img.image}
                    alt="car"
                    style={{ 
                      width: "160px", 
                      height: "100px", 
                      objectFit: "cover", 
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0" 
                    }}
                  />
                ))}
              </div>

              {/* Bottom Row: Actions */}
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", borderTop: "1px solid #f1f5f9", paddingTop: "20px" }}>
                <button
                  onClick={() => handleAction(car.id, "reject")}
                  style={btnStyle("reject")}
                  onMouseOver={(e) => e.target.style.background = "#fef2f2"}
                  onMouseOut={(e) => e.target.style.background = "#fff"}
                >
                  Reject Listing
                </button>
                <button
                  onClick={() => handleAction(car.id, "approve")}
                  style={btnStyle("approve")}
                  onMouseOver={(e) => e.target.style.opacity = "0.9"}
                  onMouseOut={(e) => e.target.style.opacity = "1"}
                >
                  Approve Listing ✅
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminCarApproval;