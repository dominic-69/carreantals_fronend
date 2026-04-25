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
    text: "#0f172a",
    muted: "#64748b",
    bg: "#f8fafc",
    card: "#ffffff"
  };

  return (
    <div style={{ padding: "60px 5%", background: colors.bg, minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* ✅ Toast Notification Container */}
      <ToastContainer />

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
          
          .accessory-card {
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            cursor: pointer;
            border: 1px solid rgba(0,0,0,0.05) !important;
          }
          .accessory-card:hover {
            transform: translateY(-12px);
            box-shadow: 0 30px 60px -12px rgba(50, 50, 93, 0.15), 0 18px 36px -18px rgba(0, 0, 0, 0.2) !important;
          }
          .img-zoom {
            transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
          }
          .accessory-card:hover .img-zoom {
            transform: scale(1.15);
          }
          .btn-animate {
            transition: all 0.3s ease;
          }
          .btn-animate:hover {
            filter: brightness(1.1);
            transform: scale(1.02);
            box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
          }
          .wishlist-btn {
             transition: all 0.3s ease;
          }
          .wishlist-btn:hover {
            background: #fff !important;
            transform: scale(1.1);
            color: #ff4757 !important;
          }
        `}
      </style>

      {/* Header Section */}
      <div style={{ marginBottom: "50px", textAlign: 'center' }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: "42px", 
          fontWeight: "800", 
          color: colors.text,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          letterSpacing: "-1px"
        }}>
          Luxury <span style={{ color: colors.primary }}>Gear</span>
        </h1>
        <p style={{ marginTop: "10px", color: colors.muted, fontSize: "18px" }}>
          Enhance your driving experience with curated premium parts.
        </p>
      </div>

      {/* Product Grid */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
        gap: "40px" 
      }}>
        {items.map((item) => (
          <div 
            key={item.id} 
            className="accessory-card"
            onClick={() => navigate(`/accessory/${item.id}`)}
            style={{
              background: colors.card,
              borderRadius: "24px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              position: "relative"
            }}
          >

            {/* Image Section */}
            <div style={{ position: "relative", height: "260px", width: "100%", overflow: "hidden" }}>
              {item.images && item.images.length > 0 ? (
                <img
                  className="img-zoom"
                  src={item.images[0].image}
                  alt={item.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div style={{ height: "100%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" }}>⚙️</div>
              )}
              
              {/* Floating Badge */}
              <div style={{ 
                position: 'absolute', 
                top: '15px', 
                left: '15px', 
                background: 'rgba(15, 23, 42, 0.8)', 
                color: '#fff', 
                padding: '5px 12px', 
                borderRadius: '20px', 
                fontSize: '10px', 
                fontWeight: '700', 
                textTransform: 'uppercase',
                backdropFilter: 'blur(4px)'
              }}>
                Premium Choice
              </div>

              <button
                className="wishlist-btn"
                onClick={(e) => handleWishlist(item.id, e)}
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "15px",
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  border: "none",
                  background: "rgba(255, 255, 255, 0.85)",
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 2,
                  backdropFilter: "blur(8px)",
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                <span style={{ fontSize: '18px' }}>❤️</span>
              </button>
            </div>

            {/* Product Details Section */}
            <div style={{ padding: "25px", flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: "12px", fontWeight: "700", color: colors.primary, textTransform: "uppercase", letterSpacing: "1.5px" }}>
                  {item.brand}
                </span>
              </div>

              <h3 style={{ 
                margin: "10px 0", 
                fontSize: "22px", 
                fontWeight: "700", 
                color: colors.text,
                fontFamily: "'Plus Jakarta Sans', sans-serif"
              }}>
                {item.name}
              </h3>
              
              <div style={{ marginTop: "auto", display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: "20px" }}>
                <div>
                  <span style={{ fontSize: '12px', color: colors.muted, display: 'block', marginBottom: '2px' }}>Starting at</span>
                  <div style={{ fontSize: "28px", fontWeight: "800", color: colors.text }}>
                    ₹{item.price.toLocaleString()}
                  </div>
                </div>

                <button
                  className="btn-animate"
                  onClick={(e) => handleAddToCart(item.id, e)}
                  style={{
                    padding: "14px 24px",
                    border: "none",
                    background: colors.text, // Dark premium button
                    color: "#fff",
                    borderRadius: "16px",
                    fontWeight: "700",
                    fontSize: "14px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    boxShadow: "0 10px 20px rgba(15, 23, 42, 0.15)"
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
  );
};

export default Accessories;