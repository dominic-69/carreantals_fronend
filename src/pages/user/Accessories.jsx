import React, { useEffect, useState } from "react";
import { getAccessories, addToCart, addToWishlist } from "../../services/api";
import { useNavigate } from "react-router-dom";

const Accessories = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAccessories();
  }, []);

  const fetchAccessories = async () => {
    try {
      const res = await getAccessories();
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = async (id, e) => {
    e.stopPropagation(); // Prevents navigating to details if button is inside card
    try {
      await addToCart(id);
      alert("Added to cart 🛒");
    } catch (err) {
      alert("Error adding to cart");
    }
  };

  const handleWishlist = async (id, e) => {
    e.stopPropagation();
    try {
      await addToWishlist(id);
      alert("Added to wishlist ❤️");
    } catch (err) {
      alert("Error adding to wishlist");
    }
  };

  // --- Styles ---
  const colors = {
    primary: "#6366f1",
    text: "#1e293b",
    muted: "#64748b",
    bg: "#f8fafc"
  };

  return (
    <div style={{ padding: "40px 60px", background: colors.bg, minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* 🎬 HOVER ANIMATION CSS */}
      <style>
        {`
          .accessory-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
          }
          .accessory-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
            border-color: #6366f1 !important;
          }
          .product-img {
            transition: transform 0.5s ease;
          }
          .accessory-card:hover .product-img {
            transform: scale(1.1);
          }
        `}
      </style>

      {/* Header */}
      <div style={{ marginBottom: "40px", borderBottom: `2px solid #e2e8f0`, paddingBottom: "20px" }}>
        <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "800", color: colors.text }}>Premium Accessories</h1>
        <p style={{ margin: "5px 0 0 0", color: colors.muted }}>Everything your car needs in one place</p>
      </div>

      {/* Grid */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
        gap: "30px" 
      }}>
        {items.map((item) => (
          <div 
            key={item.id} 
            className="accessory-card"
            onClick={() => navigate(`/accessory/${item.id}`)}
            style={{
              background: "#fff",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
              border: "1px solid #f1f5f9",
              display: "flex",
              flexDirection: "column",
              position: "relative"
            }}
          >

            {/* FIXED SIZE IMAGE CONTAINER */}
            <div style={{ position: "relative", height: "220px", width: "100%", overflow: "hidden", background: "#f1f5f9" }}>
              {item.images && item.images.length > 0 ? (
                <img
                  className="product-img"
                  src={item.images[0].image}
                  alt={item.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" }}>🛠️</div>
              )}
              
              {/* Wishlist Button */}
              <button
                onClick={(e) => handleWishlist(item.id, e)}
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "15px",
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  border: "none",
                  background: "rgba(255, 255, 255, 0.9)",
                  color: "#ef4444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 2,
                  backdropFilter: "blur(4px)"
                }}
              >
                ❤️
              </button>
            </div>

            {/* CONTENT */}
            <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "11px", fontWeight: "800", color: colors.primary, textTransform: "uppercase", letterSpacing: "1px" }}>
                {item.brand}
              </span>
              <h3 style={{ margin: "5px 0", fontSize: "19px", fontWeight: "700", color: colors.text }}>
                {item.name}
              </h3>
              
              <div style={{ marginTop: "auto", paddingTop: "15px" }}>
                <div style={{ fontSize: "24px", fontWeight: "800", color: colors.text, marginBottom: "15px" }}>
                  ₹{item.price}
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={(e) => handleAddToCart(item.id, e)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      border: "none",
                      background: colors.primary,
                      color: "#fff",
                      borderRadius: "12px",
                      fontWeight: "700",
                      fontSize: "14px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)"
                    }}
                  >
                    <span>🛒</span> Add to Cart
                  </button>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Accessories;