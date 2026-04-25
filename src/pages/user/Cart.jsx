import React, { useEffect, useState } from "react";
import { getCart, removeCart, increaseQty, decreaseQty } from "../../services/api";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data.items || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const updateAndFetch = async (action, id) => {
    await action(id);
    fetchCart();
  };

  return (
    <div style={styles.pageWrapper}>
      <style>
        {`
          .cart-card { transition: all 0.25s ease-in-out; }
          .cart-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 30px rgba(0,0,0,0.08) !important;
            border-color: #3b82f6 !important;
          }
          .checkout-btn { transition: all 0.3s ease; }
          .checkout-btn:hover {
            background: #1d4ed8 !important;
            box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
          }
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: #f8fafc; }
          ::-webkit-scrollbar-thumb { background: #cbd5e1; borderRadius: 10px; }
          ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        `}
      </style>

      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.logoBadge}>PLATINUM DRIVE</div>
          <h1 style={styles.title}>Your <span style={{color: '#3b82f6'}}>Garage</span></h1>
          <p style={{color: '#64748b', marginTop: '5px'}}>{cart.length} Vehicles in your collection</p>
        </header>

        {loading ? (
          <div style={styles.loader}>Preparing Showroom...</div>
        ) : cart.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{fontSize: '5rem', marginBottom: '20px'}}>🏎️</div>
            <h2 style={{fontSize: '1.8rem', color: '#1e293b', marginBottom: '20px'}}>Your garage is currently empty.</h2>
            <button onClick={() => navigate("/")} style={styles.emptyBtn}>Browse Vehicles</button>
          </div>
        ) : (
          <div style={styles.mainLayout}>
            
            {/* 🚗 LEFT SIDE: ITEM LIST */}
            <div style={styles.scrollArea}>
              {cart.map((item) => (
                <div key={item.cart_item_id} className="cart-card" style={styles.card}>
                  <div style={styles.imageWrapper}>
                    <img
                      src={item.image ? item.image : "/no-image.png"}
                      alt={item.name}
                      style={styles.imageStyle}
                    />
                  </div>

                  <div style={styles.content}>
                    <div style={styles.itemHeader}>
                      <div>
                        <h3 style={styles.itemName}>{item.name}</h3>
                        <p style={styles.specText}>Custom Trim • Performance Grade</p>
                      </div>
                      <button onClick={() => updateAndFetch(removeCart, item.id)} style={styles.removeIcon}>
                         ✕
                      </button>
                    </div>
                    
                    <div style={styles.actionRow}>
                      <div style={styles.qtyPicker}>
                        <button onClick={() => updateAndFetch(decreaseQty, item.id)} style={styles.qtyBtn}>−</button>
                        <span style={styles.qtyValue}>{item.quantity}</span>
                        <button onClick={() => updateAndFetch(increaseQty, item.id)} style={styles.qtyBtn}>+</button>
                      </div>
                      <div style={styles.priceTag}>
                        ₹{item.subtotal.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 🧾 RIGHT SIDE: SUMMARY BOX */}
            <div style={styles.stickyContainer}>
              <aside style={styles.summaryBox}>
                <h3 style={styles.summaryTitle}>Booking Summary</h3>
                
                <div style={styles.summaryRow}>
                  <span>Fleet Subtotal</span>
                  <span style={styles.boldText}>₹{total.toLocaleString()}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Logistics</span>
                  <span style={{color: '#10b981', fontWeight: '600'}}>Free Delivery</span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Service Tax</span>
                  <span>Calculated at Checkout</span>
                </div>
                
                <div style={styles.totalDivider}></div>
                
                <div style={styles.finalTotalRow}>
                  <span style={styles.totalLabel}>ESTIMATED TOTAL</span>
                  <span style={styles.totalAmount}>₹{total.toLocaleString()}</span>
                </div>

                <button 
                  onClick={() => navigate("/checkout")} 
                  className="checkout-btn" 
                  style={styles.checkoutBtn}
                >
                  PROCEED TO CHECKOUT
                </button>
                
                <div style={styles.secureBadge}>
                   <span style={{marginRight: '8px'}}>🔒</span> 256-bit Secure Checkout
                </div>
              </aside>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    background: "#f8fafc", // Very light blue-grey background
    padding: "60px 20px",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "50px",
    textAlign: "left",
  },
  logoBadge: {
    background: "#eff6ff",
    border: "1px solid #dbeafe",
    color: "#3b82f6",
    display: "inline-block",
    padding: "6px 16px",
    fontSize: "0.7rem",
    fontWeight: "800",
    borderRadius: "50px",
    letterSpacing: "1.2px",
  },
  title: {
    color: "#0f172a",
    fontSize: "3.2rem",
    fontWeight: "900",
    margin: "10px 0 0 0",
    letterSpacing: "-1.5px",
  },
  mainLayout: {
    display: "grid",
    gridTemplateColumns: "1fr 380px",
    gap: "50px",
    alignItems: "start",
  },
  card: {
    display: "flex",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
  },
  imageWrapper: {
    width: "180px",
    height: "120px",
    borderRadius: "14px",
    overflow: "hidden",
    background: "#f1f5f9",
    flexShrink: 0,
  },
  imageStyle: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  content: {
    flex: 1,
    paddingLeft: "25px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  itemHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemName: {
    color: "#1e293b",
    fontSize: "1.4rem",
    fontWeight: "700",
    margin: 0,
  },
  specText: {
    color: "#94a3b8",
    fontSize: "0.85rem",
    marginTop: "4px",
  },
  actionRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  qtyPicker: {
    display: "flex",
    alignItems: "center",
    background: "#f1f5f9",
    borderRadius: "12px",
    padding: "4px",
  },
  qtyBtn: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    color: "#0f172a",
    fontSize: "1rem",
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  qtyValue: {
    color: "#1e293b",
    fontWeight: "700",
    fontSize: "1rem",
    padding: "0 15px",
  },
  priceTag: {
    color: "#0f172a",
    fontSize: "1.4rem",
    fontWeight: "800",
  },
  removeIcon: {
    background: "#fee2e2",
    border: "none",
    color: "#ef4444",
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "0.8rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  stickyContainer: {
    position: "sticky",
    top: "30px",
  },
  summaryBox: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "35px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05)",
  },
  summaryTitle: {
    fontSize: "1.4rem",
    fontWeight: "800",
    marginBottom: "25px",
    color: "#0f172a",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px",
    color: "#64748b",
    fontSize: "0.95rem",
  },
  boldText: {
    color: "#1e293b",
    fontWeight: "600",
  },
  totalDivider: {
    height: "1px",
    background: "#f1f5f9",
    margin: "20px 0",
  },
  finalTotalRow: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    marginBottom: "30px",
  },
  totalLabel: {
    fontSize: "0.7rem",
    color: "#94a3b8",
    fontWeight: "800",
    letterSpacing: "0.5px",
  },
  totalAmount: {
    fontSize: "2.2rem",
    fontWeight: "900",
    color: "#0f172a",
  },
  checkoutBtn: {
    width: "100%",
    padding: "18px",
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    fontWeight: "700",
    fontSize: "1rem",
    cursor: "pointer",
  },
  emptyBtn: {
    padding: "14px 30px",
    background: "#0f172a",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },
  secureBadge: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "0.75rem",
    marginTop: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loader: { textAlign: "center", color: "#3b82f6", marginTop: "100px", fontWeight: "600" },
  emptyState: { textAlign: "center", padding: "100px 0" }
};

export default Cart;