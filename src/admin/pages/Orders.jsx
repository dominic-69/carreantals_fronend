import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { getAdminOrders, updateOrderStatus } from "../../services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getAdminOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.log("❌ Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      fetchOrders();
    } catch (err) {
      console.log("❌ Status update failed:", err);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "DELIVERED": return { color: "#065f46", bg: "#dcfce7", border: "#a7f3d0" };
      case "PENDING": return { color: "#92400e", bg: "#fef3c7", border: "#fde68a" };
      case "CONFIRMED": return { color: "#1e40af", bg: "#dbeafe", border: "#bfdbfe" };
      case "CANCELLED": return { color: "#991b1b", bg: "#fee2e2", border: "#fecaca" };
      default: return { color: "#374151", bg: "#f3f4f6", border: "#e5e7eb" };
    }
  };

  return (
    <div style={styles.pageContainer}>
      <AdminSidebar />

      <div style={styles.contentWrapper}>
        <header style={styles.header}>
          <div>
            <h2 style={styles.title}>Order Management</h2>
            <p style={styles.subtitle}>Manage fleet reservations and track delivery status</p>
          </div>
          <div style={styles.statsContainer}>
             <div style={styles.statsBadge}>
                <span style={styles.dot}></span>
                {orders.length} Active Reservations
             </div>
          </div>
        </header>

        <div style={styles.scrollContainer}>
          {loading ? (
            <div style={styles.loaderContainer}>
                <div className="spinner"></div>
                <p style={styles.loader}>Synchronizing Fleet Data...</p>
            </div>
          ) : orders.length === 0 ? (
            <div style={styles.emptyContainer}>
                <span style={{fontSize: '3rem'}}>📦</span>
                <p style={styles.empty}>No recent orders found.</p>
            </div>
          ) : (
            orders.map((order) => {
              const status = getStatusStyle(order.status);
              return (
                <div key={order.id} style={styles.orderCard} className="order-card-hover">
                  <div style={styles.cardMain}>
                    
                    {/* Customer Info */}
                    <div style={styles.infoCol}>
                      <span style={styles.orderId}>ORDER #{order.id}</span>
                      <h4 style={styles.userName}>{order.user}</h4>
                      <div style={styles.dateText}>Placed on {new Date().toLocaleDateString()}</div>
                    </div>

                    {/* Items Preview */}
                    <div style={styles.itemsPreview}>
                      {order.items?.map((item, i) => (
                        <div key={i} style={styles.miniItem}>
                          <img src={item.image || "/car-placeholder.png"} style={styles.miniImg} alt="" />
                          <div style={styles.itemMeta}>
                             <span style={styles.miniName}>{item.name}</span>
                             <span style={styles.miniQty}>Qty: {item.quantity}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pricing & Status Control */}
                    <div style={styles.statusCol}>
                      <p style={styles.totalText}>₹{order.total.toLocaleString()}</p>
                      <div style={{
                          ...styles.pill, 
                          color: status.color, 
                          background: status.bg,
                          border: `1px solid ${status.border}`
                      }}>
                        {order.status}
                      </div>
                      
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={order.status === "DELIVERED" || order.status === "CANCELLED"}
                        style={styles.dropdown}
                      >
                        <option value="" disabled>Update Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirm</option>
                        <option value="DELIVERED">Deliver</option>
                        <option value="CANCELLED">Cancel</option>
                      </select>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <style>{`
        .order-card-hover:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important;
            border-color: #3b82f6 !important;
        }
        .spinner {
            width: 30px;
            height: 30px;
            border: 3px solid #e2e8f0;
            border-top: 3px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 10px;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

const styles = {
  pageContainer: { 
    display: "flex", 
    height: "100vh", 
    overflow: "hidden", 
    background: "#f1f5f9", // Neutral slate background
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  contentWrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "40px",
    height: "100vh",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "35px",
  },
  title: { margin: 0, fontWeight: "800", fontSize: "2rem", color: "#1e293b", letterSpacing: "-0.025em" },
  subtitle: { margin: "4px 0 0 0", color: "#64748b", fontSize: "1rem" },
  statsBadge: {
    background: "#fff",
    color: "#1e293b",
    padding: "10px 20px",
    borderRadius: "12px",
    fontSize: "0.85rem",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e2e8f0"
  },
  dot: { width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" },
  scrollContainer: {
    flex: 1,
    overflowY: "auto",
    paddingRight: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  orderCard: {
    background: "#fff",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    padding: "24px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
  },
  cardMain: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "30px",
  },
  infoCol: { flex: "0 0 220px" },
  orderId: { fontSize: "0.75rem", color: "#94a3b8", fontWeight: "700", letterSpacing: "0.05em" },
  userName: { margin: "4px 0", fontSize: "1.25rem", color: "#0f172a", fontWeight: "700" },
  dateText: { fontSize: "0.8rem", color: "#94a3b8" },
  
  itemsPreview: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    borderLeft: "2px solid #f1f5f9",
    paddingLeft: "30px",
  },
  miniItem: { display: "flex", alignItems: "center", gap: "12px" },
  itemMeta: { display: "flex", flexDirection: "column" },
  miniImg: { width: "42px", height: "42px", borderRadius: "8px", objectFit: "cover", background: "#f8fafc", border: "1px solid #f1f5f9" },
  miniName: { fontSize: "0.9rem", fontWeight: "600", color: "#334155" },
  miniQty: { fontSize: "0.75rem", color: "#64748b" },

  statusCol: {
    textAlign: "right",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "12px",
    minWidth: "180px"
  },
  totalText: { margin: 0, fontSize: "1.4rem", fontWeight: "800", color: "#1e293b" },
  pill: {
    padding: "6px 14px",
    borderRadius: "8px",
    fontSize: "0.75rem",
    fontWeight: "700",
    letterSpacing: "0.025em"
  },
  dropdown: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    fontSize: "0.85rem",
    background: "#f9fafb",
    color: "#4b5563",
    cursor: "pointer",
    outline: "none",
    fontWeight: "500",
    width: "100%"
  },
  loaderContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' },
  loader: { color: "#64748b", fontWeight: "500" },
  emptyContainer: { textAlign: "center", padding: "80px 0", color: "#94a3b8" },
  empty: { marginTop: "10px", fontWeight: "500" }
};

export default Orders;