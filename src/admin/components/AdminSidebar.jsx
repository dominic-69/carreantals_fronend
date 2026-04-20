import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const menu = [
    { name: "Dashboard", path: "/admin" },
    { name: "Users", path: "/admin/users" },
    { name: "Orders", path: "/admin/orders" },
    { name: "KYC Requests", path: "/admin/kyc" },
    { name: "Support seller", path: "/admin/chat" },
    { name: "Accessories", path: "/admin/accessories" },

    // 🔥 NEW MENU ITEM
    { name: "Car Approvals", path: "/admin/car-approvals" }
  ];

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{
      width: "260px",
      height: "100vh",
      background: "#0f172a",
      color: "#fff",
      padding: "24px 16px",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Inter', system-ui, sans-serif",
      boxSizing: "border-box"
    }}>
      <div style={{
        fontSize: "1.4rem",
        fontWeight: "800",
        marginBottom: "40px",
        paddingLeft: "12px",
        color: "#6366f1",
        letterSpacing: "0.5px"
      }}>
        ADMIN<span style={{ color: "#fff", fontWeight: "300" }}>PRO</span>
      </div>

      <nav style={{ flex: 1 }}>
        {menu.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => navigate(item.path)}
              style={{
                padding: "12px 16px",
                marginBottom: "8px",
                cursor: "pointer",
                borderRadius: "10px",
                fontSize: "0.95rem",
                transition: "all 0.2s ease",
                backgroundColor: isActive
                  ? "#6366f1"
                  : (hoveredIndex === index
                      ? "rgba(255,255,255,0.05)"
                      : "transparent"),
                color: isActive ? "#fff" : "#94a3b8",
                fontWeight: isActive ? "600" : "400",
                display: "flex",
                alignItems: "center"
              }}
            >
              {item.name}
            </div>
          );
        })}
      </nav>

      <div 
        onClick={logout}
        style={{
          padding: "12px 16px",
          color: "#f87171",
          cursor: "pointer",
          fontWeight: "600",
          borderRadius: "10px",
          border: "1px solid rgba(248, 113, 113, 0.2)",
          textAlign: "center",
          transition: "background 0.2s"
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(248, 113, 113, 0.1)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
      >
        Logout
      </div>
    </div>
  );
};

export default AdminSidebar;