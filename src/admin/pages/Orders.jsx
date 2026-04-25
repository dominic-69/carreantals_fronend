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
      case "DELIVERED": return { color: "#10b981", bg: "#dcfce7" };
      case "PENDING": return { color: "#f59e0b", bg: "#fef3c7" };
      case "CONFIRMED": return { color: "#3b82f6", bg: "#dbeafe" };
      case "CANCELLED": return { color: "#ef4444", bg: "#fee2e2" };
      default: return { color: "#64748b", bg: "#f1f5f9" };
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#f8fafc" }}>
      <AdminSidebar />

      <div style={styles.contentWrapper}>
        <header style={styles.header}>
          <div>
            <h2 style={styles.title}>Fleet Orders</h2>
            <p style={styles.subtitle}>Review and update customer reservations</p>
          </div>
          <div style={styles.statsBadge}>{orders.length} ACTIVE ORDERS</div>
        </header>

        {/* 📜 SCROLLABLE CONTAINER STARTS HERE */}
        <div style={styles.scrollContainer}>
          {loading ? (
            <p style={styles.loader}>Accessing Database...</p>
          ) : orders.length === 0 ? (
            <div style={styles.empty}>No orders to display.</div>
          ) : (
            orders.map((order) => {
              const status = getStatusStyle(order.status);
              return (
                <div key={order.id} style={styles.orderCard}>
                  <div style={styles.cardMain}>
                    <div style={styles.infoCol}>
                      <span style={styles.orderId}>ID: #{order.id}</span>
                      <h4 style={styles.userName}>{order.user}</h4>
                      <p style={styles.totalText}>Total: ₹{order.total.toLocaleString()}</p>
                    </div>

                    <div style={styles.itemsPreview}>
                      {order.items?.map((item, i) => (
                        <div key={i} style={styles.miniItem}>
                          <img src={item.image || "/car-placeholder.png"} style={styles.miniImg} alt="" />
                          <span style={styles.miniName}>{item.name} (x{item.quantity})</span>
                        </div>
                      ))}
                    </div>

                    <div style={styles.statusCol}>
                      <div style={{...styles.pill, color: status.color, background: status.bg}}>
                        {order.status}
                      </div>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={order.status === "DELIVERED" || order.status === "CANCELLED"}
                        style={styles.dropdown}
                      >
                        <option value="PENDING">Set Pending</option>
                        <option value="CONFIRMED">Set Confirmed</option>
                        <option value="DELIVERED">Set Delivered</option>
                        <option value="CANCELLED">Set Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {/* 📜 SCROLLABLE CONTAINER ENDS */}
      </div>
    </div>
  );
};

const styles = {
  contentWrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "30px",
    height: "100vh", // Lock height to screen
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },
  title: { margin: 0, fontWeight: "800", fontSize: "1.8rem", color: "#0f172a" },
  subtitle: { margin: "5px 0 0 0", color: "#64748b" },
  statsBadge: {
    background: "#0f172a",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "8px",
    fontSize: "0.75rem",
    fontWeight: "bold",
    letterSpacing: "1px",
  },
  scrollContainer: {
    flex: 1, // Takes remaining space
    overflowY: "auto", // Enable scrolling only here
    paddingRight: "10px", // Space for scrollbar
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  orderCard: {
    background: "#fff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    padding: "20px",
    transition: "transform 0.2s ease",
  },
  cardMain: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
  },
  infoCol: { flex: "0 0 200px" },
  orderId: { fontSize: "0.7rem", color: "#94a3b8", fontWeight: "bold" },
  userName: { margin: "5px 0", fontSize: "1.1rem", color: "#1e293b" },
  totalText: { margin: 0, fontWeight: "700", color: "#3b82f6" },
  
  itemsPreview: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    borderLeft: "1px solid #f1f5f9",
    paddingLeft: "20px",
  },
  miniItem: { display: "flex", alignItems: "center", gap: "10px" },
  miniImg: { width: "35px", height: "35px", borderRadius: "6px", objectFit: "cover", background: "#f8fafc" },
  miniName: { fontSize: "0.85rem", color: "#475569" },

  statusCol: {
    textAlign: "right",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "10px",
  },
  pill: {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.7rem",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  dropdown: {
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "0.8rem",
    background: "#fff",
    cursor: "pointer",
    outline: "none",
  },
  loader: { textAlign: "center", padding: "40px", color: "#64748b" },
  empty: { textAlign: "center", padding: "40px", color: "#94a3b8" }
};

export default Orders;