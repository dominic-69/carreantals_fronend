import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SellerSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    // 🚗 CARS
    { name: "Dashboard", path: "/seller" },
    { name: "Add Car", path: "/seller/add-car" },
    { name: "My Cars", path: "/seller/my-cars" },

    // 🛒 ACCESSORIES
    { name: "Add Accessory", path: "/seller/add-accessory" },
    { name: "My Accessories", path: "/seller/my-accessories" },

    // 💬 CHAT
    { name: "Support Chat", path: "/chat" },
  ];

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>Seller</h2>

      {menu.map((item, index) => (
        <div
          key={index}
          style={{
            ...styles.item,
            background:
              location.pathname === item.path ? "#00d2ff" : "transparent",
          }}
          onClick={() => navigate(item.path)}
        >
          {item.name}
        </div>
      ))}

      <div style={styles.logout} onClick={logout}>
        Logout
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "220px",
    height: "100vh",
    background: "#111",
    color: "#fff",
    padding: "20px",
  },
  logo: {
    marginBottom: "30px",
  },
  item: {
    padding: "10px",
    marginBottom: "10px",
    cursor: "pointer",
    borderRadius: "8px",
  },
  logout: {
    marginTop: "50px",
    color: "red",
    cursor: "pointer",
  },
};

export default SellerSidebar;