import React, { useEffect, useState } from "react";
import { getWishlist, removeWishlist, addToCart } from "../../services/api";

function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await getWishlist();
      setItems(res.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    await removeWishlist(id);
    fetchWishlist();
  };

  const handleMoveToCart = async (id) => {
    await addToCart(id);
    await removeWishlist(id);
    fetchWishlist();
  };

  return (
    <div style={styles.pageWrapper}>
      {/* 🏎️ CUSTOM STYLES FOR CARDS & ANIMATIONS */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .wish-card {
            animation: fadeIn 0.5s ease forwards;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          .wish-card:hover {
            transform: translateY(-10px);
            background: rgba(255, 255, 255, 0.08) !important;
            border-color: #3b82f6 !important;
            box-shadow: 0 20px 40px rgba(0,0,0,0.4);
          }
          .action-btn {
            transition: all 0.2s ease;
          }
          .action-btn:active {
            transform: scale(0.95);
          }
        `}
      </style>

      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.badge}>PREMIUM WATCHLIST</div>
          <h1 style={styles.title}>My Dream <span style={{color: '#3b82f6'}}>Garage</span></h1>
          <p style={styles.subtitle}>Reserved vehicles awaiting your final decision.</p>
        </header>

        {loading ? (
          <p style={styles.statusText}>Accessing secure vault...</p>
        ) : items.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{fontSize: '50px', marginBottom: '20px'}}>🏎️</div>
            <h3>Your wishlist is empty.</h3>
            <p>Start adding your favorite performance vehicles.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {items.map((item) => (
              <div key={item.id} className="wish-card" style={styles.card}>
                <div style={styles.imageContainer}>
                   <img 
                    src={item.image || "/no-image.png"} 
                    alt={item.name} 
                    style={styles.image} 
                  />
                  <div style={styles.priceOverlay}>₹{item.price.toLocaleString()}</div>
                </div>

                <div style={styles.info}>
                  <h3 style={styles.itemName}>{item.name}</h3>
                  <p style={styles.itemSpecs}>Automatic • 2026 Edition • Petrol</p>
                  
                  <div style={styles.buttonGroup}>
                    <button
                      onClick={() => handleMoveToCart(item.id)}
                      className="action-btn"
                      style={styles.cartBtn}
                    >
                      RESERVE NOW
                    </button>

                    <button
                      onClick={() => handleRemove(item.id)}
                      className="action-btn"
                      style={styles.removeBtn}
                    >
                      ✕
                    </button>
                  </div>
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
  pageWrapper: {
    minHeight: "100vh",
    background: "#020617", // Solid deep dark for the wishlist
    padding: "60px 20px",
    fontFamily: "'Inter', sans-serif",
    color: "#fff",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "50px",
    textAlign: "left",
  },
  badge: {
    color: "#3b82f6",
    fontSize: "0.8rem",
    fontWeight: "800",
    letterSpacing: "2px",
    marginBottom: "10px",
  },
  title: {
    fontSize: "3rem",
    fontWeight: "900",
    margin: 0,
  },
  subtitle: {
    color: "#64748b",
    marginTop: "10px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "30px",
  },
  card: {
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "24px",
    overflow: "hidden",
    backdropFilter: "blur(10px)",
  },
  imageContainer: {
    position: "relative",
    height: "200px",
    background: "linear-gradient(180deg, #1e293b, #020617)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "90%",
    height: "auto",
    objectFit: "contain",
  },
  priceOverlay: {
    position: "absolute",
    bottom: "15px",
    right: "15px",
    background: "rgba(0,0,0,0.7)",
    padding: "5px 12px",
    borderRadius: "8px",
    fontSize: "0.9rem",
    fontWeight: "700",
    backdropFilter: "blur(5px)",
  },
  info: {
    padding: "25px",
  },
  itemName: {
    fontSize: "1.4rem",
    fontWeight: "700",
    margin: "0 0 5px 0",
  },
  itemSpecs: {
    color: "#475569",
    fontSize: "0.85rem",
    marginBottom: "20px",
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
  },
  cartBtn: {
    flex: 1,
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    padding: "14px",
    borderRadius: "12px",
    fontWeight: "800",
    fontSize: "0.8rem",
    cursor: "pointer",
    letterSpacing: "1px",
  },
  removeBtn: {
    width: "45px",
    background: "rgba(239, 68, 68, 0.1)",
    color: "#ef4444",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    borderRadius: "12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    textAlign: "center",
    color: "#3b82f6",
    marginTop: "50px",
  },
  emptyState: {
    textAlign: "center",
    padding: "100px 0",
    color: "#475569",
  }
};

export default Wishlist;