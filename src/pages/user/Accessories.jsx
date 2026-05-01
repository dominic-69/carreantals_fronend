import React, { useEffect, useState } from "react";
import { getAccessories, addToCart, addToWishlist } from "../../services/api";
import { useNavigate } from "react-router-dom";
// ✅ Import Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      toast.error("Failed to load accessories 🛰️");
    }
  };

  const handleAddToCart = async (id, e) => {
    e.stopPropagation();
    try {
      await addToCart(id);
      toast.success("Added to cart! 🛒", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "colored",
      });
    } catch (err) {
      toast.error("Could not add to cart ❌");
    }
  };

  const handleWishlist = async (id, e) => {
    e.stopPropagation();
    try {
      await addToWishlist(id);
      toast.info("Added to wishlist ❤️", {
        position: "bottom-right",
        autoClose: 2000,
      });
    } catch (err) {
      toast.error("Error adding to wishlist");
    }
  };

  const colors = {
    primary: "#6366f1",
    accent: "#4f46e5",
    text: "#1e293b",
    muted: "#64748b",
    bg: "#f1f5f9",
    card: "#ffffff",
    border: "#e2e8f0"
  };

  return (
    <div style={{ background: colors.bg, minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* ✅ Toast Notification Container */}
      <ToastContainer />

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
          
          .accessory-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
          }
          .accessory-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }
          .nav-btn {
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            padding: 8px 16px;
            border-radius: 8px;
            color: ${colors.muted};
            font-weight: 600;
          }
          .nav-btn:hover {
            background: #fff;
            color: ${colors.primary};
          }
          .btn-primary {
            transition: all 0.2s ease;
          }
          .btn-primary:hover {
            background: ${colors.accent} !important;
            transform: scale(1.02);
          }
          .btn-secondary {
            transition: all 0.2s ease;
            background: #f1f5f9;
            color: #1e293b;
          }
          .btn-secondary:hover {
            background: #e2e8f0;
          }
          .wishlist-btn:hover {
            background: #fee2e2 !important;
            color: #ef4444 !important;
          }
        `}
      </style>

      {/* Standard Navigation Bar */}
      <div style={{ 
        background: "#fff", 
        padding: "15px 5%", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        borderBottom: `1px solid ${colors.border}`,
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div onClick={() => navigate("/")} className="nav-btn">
          <span>←</span> Back to Home
        </div>
        <div style={{ fontWeight: '800', fontSize: '20px', color: colors.text }}>
          Auto<span style={{ color: colors.primary }}>Drive</span> Shop
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div onClick={() => navigate("/cart")} className="nav-btn">🛒 Cart</div>
        </div>
      </div>

      <div style={{ padding: "40px 5%" }}>
        {/* Page Title */}
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: "32px", 
            fontWeight: "800", 
            color: colors.text,
            fontFamily: "'Plus Jakarta Sans', sans-serif"
          }}>
            Premium Accessories
          </h1>
          <p style={{ color: colors.muted, marginTop: '5px' }}>Discover the best gear for your vehicle.</p>
        </div>

        {/* Product Grid */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
          gap: "30px" 
        }}>
          {items.map((item) => (
            <div 
              key={item.id} 
              className="accessory-card"
              style={{
                background: colors.card,
                borderRadius: "16px",
                overflow: "hidden",
                border: `1px solid ${colors.border}`,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Image Section */}
              <div 
                style={{ position: "relative", height: "240px", width: "100%", overflow: "hidden", background: '#f8fafc' }}
                onClick={() => navigate(`/accessory/${item.id}`)}
              >
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[0].image}
                    alt={item.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" }}>⚙️</div>
                )}
                
                <button
                  className="wishlist-btn"
                  onClick={(e) => handleWishlist(item.id, e)}
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    border: "none",
                    background: "rgba(255, 255, 255, 0.9)",
                    color: "#64748b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                  }}
                >
                  ❤️
                </button>
              </div>

              {/* Info Section */}
              <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", color: colors.primary, textTransform: "uppercase", letterSpacing: "1px" }}>
                  {item.brand}
                </span>

                <h3 style={{ 
                  margin: "8px 0", 
                  fontSize: "18px", 
                  fontWeight: "700", 
                  color: colors.text,
                }}>
                  {item.name}
                </h3>
                
                <div style={{ fontSize: "20px", fontWeight: "800", color: colors.text, marginBottom: '15px' }}>
                  ₹{item.price.toLocaleString()}
                </div>

                <div style={{ marginTop: "auto", display: 'flex', gap: '10px' }}>
                  {/* 🔥 VIEW DETAILS BUTTON */}
                  <button
                    className="btn-secondary"
                    onClick={() => navigate(`/accessory/${item.id}`)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      border: "none",
                      borderRadius: "10px",
                      fontWeight: "700",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    View Details
                  </button>

                  {/* ADD TO CART BUTTON */}
                  <button
                    className="btn-primary"
                    onClick={(e) => handleAddToCart(item.id, e)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      border: "none",
                      background: colors.primary,
                      color: "#fff",
                      borderRadius: "10px",
                      fontWeight: "700",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Accessories;